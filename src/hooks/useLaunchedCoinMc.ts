import { useChain } from "@/context/chain";
import { Token } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import useTokenInfo from "./useTokenInfo";

export default function useLaunchedCoinMc(token: Token) {
  const { chain } = useChain();
  const { tokenInfo } = useTokenInfo(token);

  const { data} = useQuery({
    queryKey: ["launched-coin-marketcap", token.tokenAddress, chain.name],
    queryFn: async () => {
      const response = await fetch(
        `/api/launched-coin-marketcap?chain=${chain.name}&contractAddress=${token.tokenAddress}`
      );
      const data = await response.json();
      return data;
    },
    enabled: !!tokenInfo?.liquidityPoolSeeded,
  });

  return data?.marketcap || null;
}
