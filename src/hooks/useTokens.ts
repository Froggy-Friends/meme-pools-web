import { TokenFilter } from "@/models/token";
import { fetchTokens } from "@/queries/token/queries";
import { useQuery } from "@tanstack/react-query";

export default function useTokens(filter: TokenFilter, page: number) {
  const {
    data: tokens,
    isPending: isLoadingTokens,
    refetch,
  } = useQuery({
    queryKey: ["tokens", filter, page],
    queryFn: () => fetchTokens(filter, page),
  });

  return {
    tokens,
    isLoadingTokens,
    refetch,
  };
}
