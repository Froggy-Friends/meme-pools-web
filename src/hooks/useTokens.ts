import fetchTokens from "@/lib/fetchTokens";
import { useQuery } from "@tanstack/react-query";

type TokenFilter = "new" | "trending" | "volume" | "transactions";

export function useTokens(filter?: TokenFilter, page?: number) {
  const tokenQuery = useQuery({
    queryKey: ["tokens", filter, page],
    queryFn: () => fetchTokens(filter, page),
  });

  return {
    tokens: tokenQuery.data,
    isLoadingTokens: tokenQuery.isLoading,
  };
}
