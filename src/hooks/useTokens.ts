import { useChain } from "@/context/chain";
import { TokenFilter } from "@/models/token";
import { fetchTokens } from "@/queries/token/queries";
import { useQuery } from "@tanstack/react-query";

type UseTokenOptions = {
  filter: TokenFilter;
  page: number;
  reverse: boolean;
  isNsfw: boolean;
};

export default function useTokens({
  filter,
  page,
  reverse,
  isNsfw,
}: UseTokenOptions) {
  const { chain } = useChain();

  const {
    data: tokens,
    isPending: isLoadingTokens,
    refetch,
  } = useQuery({
    queryKey: [`tokens-${chain.name}`, filter, page, reverse, isNsfw],
    queryFn: async () => {
      const tokens = await fetchTokens(filter, page, chain.name);
      let filteredTokens = tokens;
      if (!isNsfw) {
        filteredTokens = tokens.filter((token) => !token.isNsfw);
      }
      return reverse ? filteredTokens.reverse() : filteredTokens;
    },
  });

  return {
    tokens,
    isLoadingTokens,
    refetch,
  };
}
