import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress } from "@/config/env";
import { Token } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatUnits } from "viem";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";
import getEthPrice from "@/lib/getEthPrice";
import { useReadContract } from "wagmi";

export default function useTokenInfo(token: Token) {
  const queryClient = useQueryClient();

  const { data: tokenInfoRaw, refetch: refetchTokenInfoRaw } = useReadContract({
    address: contractAddress,
    abi: memepoolsAbi,
    functionName: "tokenInfos",
    args: [token.tokenAddress],
  }) as { data: any[]; refetch: () => void };

  const { data: tokenInfo, refetch: refetchTokenInfo } = useQuery({
    queryKey: ["tokenInfo", token.id],
    queryFn: async () => {
      const ethPrice = await getEthPrice();
      if (!tokenInfoRaw) return null;

      return {
        tokenAddress: tokenInfoRaw[0],
        creator: tokenInfoRaw[1],
        totalSupply: Number(formatUnits(tokenInfoRaw[2], 18)),
        availableSupply: Number(formatUnits(tokenInfoRaw[3], 18)),
        marketcap: Number(formatUnits(tokenInfoRaw[4], 18)) * ethPrice,
        tokensSold: Number(formatUnits(tokenInfoRaw[5], 18)),
        balance: tokenInfoRaw[6],
        price: tokenInfoRaw[7],
        name: tokenInfoRaw[8],
        symbol: tokenInfoRaw[9],
        readyForLp: tokenInfoRaw[10],
        liquidityPoolSeeded: tokenInfoRaw[11],
      };
    },
    enabled: !!tokenInfoRaw,
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
      refetchTokenInfoRaw();

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["tokenInfo", token.id],
        });
      }, 1000);

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["maxBuyPrice", token.id],
        });
      }, 2000);
    };

    buyChannel.bind(token.id, handleTrade);
    sellChannel.bind(token.id, handleTrade);

    return () => {
      buyChannel.unbind(token.id, handleTrade);
      sellChannel.unbind(token.id, handleTrade);
      pusher.unsubscribe(Channel.Buy);
      pusher.unsubscribe(Channel.Sell);
    };
  }, [token.id, queryClient, tokenInfo?.availableSupply, refetchTokenInfoRaw]);

  return {
    tokenInfo,
    refetchTokenInfo,
  };
}
