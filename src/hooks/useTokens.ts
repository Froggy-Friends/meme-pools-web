import { useChain } from "@/context/chain";
import { TokenFilter } from "@/models/token";
import { fetchTokens } from "@/queries/token/queries";
import { useQuery } from "@tanstack/react-query";

type UseTokenOptions = {
  filter: TokenFilter;
  page: number;
  reverse: boolean;
};

export default function useTokens({ filter, page, reverse }: UseTokenOptions) {
  const { chain } = useChain();
  
  const {
    data: tokens,
    isPending: isLoadingTokens,
    refetch,
  } = useQuery({
    queryKey: ["tokens", filter, page, reverse],
    queryFn: async () => {
      const tokens = await fetchTokens(filter, page, chain.name);
      return reverse ? tokens.reverse() : tokens;
    },
  });

  return {
    tokens,
    isLoadingTokens,
    refetch,
  };
}
