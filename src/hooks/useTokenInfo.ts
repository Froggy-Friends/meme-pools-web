import { Token } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatUnits } from "viem";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { Channel } from "@/models/channel";
import { TradeWithUserAndToken } from "@/types/token/types";
import { useChain } from "@/context/chain";
import { getViemClient } from "@/lib/getPublicClient";
import { getMemePoolsAbi, getNativeTokenPrice } from "@/lib/chains";

export default function useTokenInfo(token: Token) {
  const { chain } = useChain();
  const publicClient = getViemClient(chain.name);
  const queryClient = useQueryClient();

  const { data: tokenInfo, refetch: refetchTokenInfo } = useQuery({
    queryKey: ["tokenInfo", token.id, chain.name],
    queryFn: async () => {
      const abi = getMemePoolsAbi(chain.name);
      const [nativeTokenPrice, rawInfo] = (await Promise.all([
        getNativeTokenPrice(chain.name),
        publicClient?.readContract({
          address: token.platformAddress as `0x${string}`,
          abi: abi,
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
        marketcap: Number(formatUnits(rawInfo[4], 18)) * nativeTokenPrice,
        tokensSold: Number(formatUnits(rawInfo[5], 18)),
        balance: rawInfo[6],
        price: rawInfo[7],
        name: rawInfo[8],
        symbol: rawInfo[9],
        readyForLp: rawInfo[10],
        liquidityPoolSeeded: rawInfo[11],
        autoLaunch: rawInfo[12],
        availableSupplyRaw: rawInfo[3],
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

    buyChannel.bind(token.id, ({ trade }: { trade: TradeWithUserAndToken }) => {
      if (trade) {
        queryClient.invalidateQueries({ queryKey: ["tokenInfo", token.id] });
      }
    });

    sellChannel.bind(
      token.id,
      ({ trade }: { trade: TradeWithUserAndToken }) => {
        if (trade) {
          queryClient.invalidateQueries({ queryKey: ["tokenInfo", token.id] });
        }
      }
    );

    return () => {
      buyChannel.unbind();
      sellChannel.unbind();
      pusher.disconnect();
    };
  }, [tokenInfo, queryClient, token.id]);

  return {
    tokenInfo,
    refetchTokenInfo,
  };
}
