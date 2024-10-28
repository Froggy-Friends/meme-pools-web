import { memepoolsAbi } from "@/abi/memepools";
import { contractAddress, ethChain, rpcUrl } from "@/config/env";
import { Token } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { createPublicClient, formatUnits, http } from "viem";
import { TokenInfo } from "@/types/token/types";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";
import getEthPrice from "@/lib/getEthPrice";

export default function useTokenInfo(token: Token) {
  const queryClient = useQueryClient();
  const publicClient = createPublicClient({
    chain: ethChain,
    transport: http(rpcUrl),
  });

  const getTokenInfo = useCallback(async () => {
    const ethPrice = await getEthPrice();
    const tokenInfo = (await publicClient.readContract({
      address: contractAddress,
      abi: memepoolsAbi,
      functionName: "tokenInfos",
      args: [token.tokenAddress],
    })) as any[];

    let result: TokenInfo = {
      tokenAddress: tokenInfo[0],
      creator: tokenInfo[1],
      totalSupply: Number(formatUnits(tokenInfo[2], 18)),
      availableSupply: Number(formatUnits(tokenInfo[3], 18)),
      marketcap: Number(formatUnits(tokenInfo[4], 18)) * ethPrice,
      tokensSold: Number(formatUnits(tokenInfo[5], 18)),
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
      queryClient.invalidateQueries({ queryKey: ["tokenInfo", token.id] });
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
    tokenInfo,
    refetchTokenInfo,
  };
}
