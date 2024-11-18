import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { Token } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatUnits } from "viem";
import getEthPrice from "@/lib/getEthPrice";
import { usePublicClient } from "wagmi";

export default function useTokenInfo(token: Token) {
  const publicClient = usePublicClient();

  const { data: tokenInfo, refetch: refetchTokenInfo } = useQuery({
    queryKey: ["tokenInfo", token.id],
    queryFn: async () => {
      const [ethPrice, rawInfo] = (await Promise.all([
        getEthPrice(),
        publicClient?.readContract({
          address: contractAddress,
          abi: memepoolsAbi,
          functionName: "tokenInfos",
          args: [token.tokenAddress],
        }),
      ])) as [number, any[]];

      if (!rawInfo) return null;

      return {
        tokenAddress: rawInfo[0],
        creator: rawInfo[1],
        totalSupply: Number(formatUnits(rawInfo[2], 18)),
        availableSupply: Number(formatUnits(rawInfo[3], 18)),
        marketcap: Number(formatUnits(rawInfo[4], 18)) * ethPrice,
        tokensSold: Number(formatUnits(rawInfo[5], 18)),
        balance: rawInfo[6],
        price: rawInfo[7],
        name: rawInfo[8],
        symbol: rawInfo[9],
        readyForLp: rawInfo[10],
        liquidityPoolSeeded: rawInfo[11],
        autoLaunch: rawInfo[12],
      };
    },
  });

  return {
    tokenInfo,
    refetchTokenInfo,
  };
}
