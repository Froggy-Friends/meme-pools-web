import { fetchTokenCount } from "@/queries/token/queries";
import { useQuery } from "@tanstack/react-query";

export default function useTokenCount() {
  const { data: tokenCount } = useQuery({
    queryKey: ["tokenCount"],
    queryFn: async () => {
      const tokenCount = await fetchTokenCount();
      return tokenCount;
    },
  });

  return { tokenCount };
}
