import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

export default function useQueryParamState<T extends number | string>(
  key: string,
  defaultValue: T
) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const initialValue = useMemo(() => {
    const valueFromQuery = searchParams.get(key);
    const value = valueFromQuery ?? defaultValue;

    return typeof defaultValue === "number" ? (+value as T) : (value as T);
  }, []);

  const [value, setValue] = useState<T>(initialValue);
  const { push } = useRouter();

  const setQueryParam = useCallback((newValue: T) => {
    setValue(newValue);
    push(pathname + "?" + createQueryString(key, newValue.toString()));
  }, []);

  return [value, setQueryParam] as const;
}
