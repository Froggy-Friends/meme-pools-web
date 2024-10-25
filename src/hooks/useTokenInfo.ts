import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress, ethChain, rpcUrl } from "@/config/env";
import { Token } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { createPublicClient, http } from "viem";

type TokenInfo = [string, string, bigint, bigint, bigint, bigint, bigint, bigint, string, string, boolean];

export default function useTokenInfo(token: Token) {
    const publicClient = createPublicClient({
      chain: ethChain,
      transport: http(rpcUrl),
    });
  
    const getTokenInfo = useCallback(async () => {
      const tokenInfo = await publicClient.readContract({
        address: contractAddress,
        abi: frogFunAbi,
        functionName: "tokenInfos",
        args: [token.tokenAddress],
      });
      
      return tokenInfo as TokenInfo;
    }, [publicClient, token.tokenAddress]);
  
    const { data: tokenInfo, refetch: refetchTokenInfo } = useQuery({
      queryKey: ["tokenInfo", token.id],
      queryFn: () => getTokenInfo(),
    });

    return {
        tokenInfo,
        refetchTokenInfo,
    }
}
