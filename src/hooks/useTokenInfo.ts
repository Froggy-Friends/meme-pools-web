import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { Token } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatUnits } from "viem";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";
import getEthPrice from "@/lib/getEthPrice";
import { usePublicClient } from "wagmi";

export default function useTokenInfo(token: Token) {
  const queryClient = useQueryClient();
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
      };
    },
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

    const handleTrade = async () => {};

    buyChannel.bind(token.id, handleTrade);
    sellChannel.bind(token.id, handleTrade);

    return () => {
      buyChannel.unbind(token.id, handleTrade);
      sellChannel.unbind(token.id, handleTrade);
      pusher.unsubscribe(Channel.Buy);
      pusher.unsubscribe(Channel.Sell);
    };
  }, [token.id, queryClient, tokenInfo?.availableSupply, refetchTokenInfo]);

  return {
    tokenInfo,
    refetchTokenInfo,
  };
}
