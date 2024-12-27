import { useQuery } from "@tanstack/react-query";
import { Address } from "viem";
import { TokenType } from "@/models/token";
import { Chain } from "@/models/chain";

export default function useIsAHolder(
  tokenAddress: Address,
  address: Address,
  type: TokenType,
  chain: Chain
) {
  const { data: isHolder } = useQuery({
    queryKey: ["isHolder", tokenAddress, address, type, chain],
    queryFn: async () => {
      if (!tokenAddress || !address || !type) return false;

      const response = await fetch(
        `/api/token-holder?address=${address}&type=${type}&tokenAddress=${tokenAddress}&chain=${chain}`
      );

      const data = await response.json();
      return data.isHolder;
    },
    enabled: Boolean(tokenAddress && address && type),
  });

  return { isHolder };
}
