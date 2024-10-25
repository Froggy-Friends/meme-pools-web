import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress, ethChain, rpcUrl } from "@/config/env";
import { Token } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { createPublicClient, http } from "viem";
import { TokenInfo } from "@/types/token/types";

type TokenInfosReturn = [
  string,
  string,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  bigint,
  string,
  string,
  boolean
];

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

    return tokenInfo as TokenInfosReturn;
  }, [publicClient, token.tokenAddress]);

  const { data, refetch: refetchTokenInfo } = useQuery({
    queryKey: ["tokenInfo", token.id],
    queryFn: () => getTokenInfo(),
  });

  const tokenInfo: TokenInfo = {
    tokenAddress: data?.[0],
    creator: data?.[1],
    totalSupply: data?.[2],
    availableSupply: data?.[3],
    marketcap: data?.[4],
    tokensSold: data?.[5],
    balance: data?.[6],
    price: data?.[7],
    name: data?.[8],
    symbol: data?.[9],
    liquidityPoolSeeded: data?.[10],
  };

  return {
    tokenInfo,
    refetchTokenInfo,
  };
}
