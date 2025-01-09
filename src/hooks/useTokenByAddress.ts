import { Chain } from "@/models/chain";
import { fetchTokenByAddress } from "@/queries/token/queries";
import { useQuery } from "@tanstack/react-query";

export default function useTokenByAddress(tokenAddress: string, chain: Chain) {
  const {
    data: token,
    isPending: isLoadingToken,
    refetch,
  } = useQuery({
    queryKey: ["token-by-address", tokenAddress],
    queryFn: async () => {
      if (!tokenAddress) return null;
      const token = await fetchTokenByAddress(tokenAddress, chain);
      return token;
    },
  });

  return {
    token,
    isLoadingToken,
    refetch,
  };
}
