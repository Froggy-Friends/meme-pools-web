import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress, ethChain, rpcUrl } from "@/config/env";
import { Token } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { createPublicClient, http } from "viem";
import { TokenInfo } from "@/types/token/types";

export default function useTokenInfo(token: Token) {
  const publicClient = createPublicClient({
    chain: ethChain,
    transport: http(rpcUrl),
  });

  const getTokenInfo = useCallback(async () => {
    const tokenInfo = (await publicClient.readContract({
      address: contractAddress,
      abi: memepoolsAbi,
      functionName: "tokenInfos",
      args: [token.tokenAddress],
    })) as any[];

    let result: TokenInfo = {
      tokenAddress: tokenInfo[0],
      creator: tokenInfo[1],
      totalSupply: tokenInfo[2],
      availableSupply: tokenInfo[3],
      marketcap: tokenInfo[4],
      tokensSold: tokenInfo[5],
      balance: tokenInfo[6],
      price: tokenInfo[7],
      name: tokenInfo[8],
      symbol: tokenInfo[9],
      liquidityPoolSeeded: tokenInfo[10],
    };

    return result;
  }, [publicClient, token.tokenAddress]);

  const { data: tokenInfo, refetch: refetchTokenInfo } = useQuery({
    queryKey: ["tokenInfo", token.id],
    queryFn: () => getTokenInfo(),
  });

  return {
    tokenInfo,
    refetchTokenInfo,
  };
}
