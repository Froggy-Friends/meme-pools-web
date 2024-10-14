import { frogFunAbi } from "@/abi/frogFun";
import { contractAddress, ethChain, rpcUrl } from "@/config/env";
import getEthPrice from "@/lib/getEthPrice";
import { Token } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { createPublicClient, formatUnits, http } from "viem";
import Pusher from "pusher-js";
import { Channel } from "@/models/channel";

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

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER ||
      !process.env.NEXT_PUBLIC_PUSHER_KEY
    ) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const buyChannel = pusher.subscribe(Channel.Buy);
    const sellChannel = pusher.subscribe(Channel.Sell);

    const handleTrade = () => {
      queryClient.invalidateQueries({ queryKey: ["tokenMarketcap", token.id] });
    };

    buyChannel.bind(token.id, handleTrade);
    sellChannel.bind(token.id, handleTrade);

    return () => {
      buyChannel.unbind(token.id, handleTrade);
      sellChannel.unbind(token.id, handleTrade);
      pusher.unsubscribe(Channel.Buy);
      pusher.unsubscribe(Channel.Sell);
    };
  }, [token.id, queryClient]);

  return {
    tokenMarketcap,
  };
}
