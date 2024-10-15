import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress, ethChain, rpcUrl } from "@/config/env";
import getEthPrice from "@/lib/getEthPrice";
import { Token } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { createPublicClient, formatUnits, http } from "viem";
import { Channel } from "@/models/channel";
import usePusher from "./usePusher";

export default function useTokenMarketcap(token: Token) {
  const queryClient = useQueryClient();
  const publicClient = createPublicClient({
    chain: ethChain,
    transport: http(rpcUrl),
  });

  const getTokenMarketcap = useCallback(async () => {
    const ethPrice = await getEthPrice();
    const marketcap = await publicClient.readContract({
      address: contractAddress,
      abi: frogFunAbi,
      functionName: "getTokenMarketcap",
      args: [token.tokenAddress],
    });
    return Number(formatUnits(marketcap as unknown as bigint, 18)) * ethPrice;
  }, [publicClient, token.tokenAddress]);

  const { data: tokenMarketcap } = useQuery({
    queryKey: ["tokenMarketcap", token.id],
    queryFn: () => getTokenMarketcap(),
  });

  const handleTrade = () => {
    queryClient.invalidateQueries({ queryKey: ["tokenMarketcap", token.id] });
  };

  usePusher(token.id, handleTrade, [Channel.Buy, Channel.Sell]);

  return {
    tokenMarketcap,
  };
}
