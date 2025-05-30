import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TokenHolderData } from "@/types/token/types";
import { Chain } from "@/models/chain";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { Channel } from "@/models/channel";

export default function useTokenHolders(
  tokenAddress: string,
  chain: Chain,
  tokenId: string
) {
  const queryClient = useQueryClient();

  const { data: holders } = useQuery({
    queryKey: ["tokenHolders", chain, tokenAddress],
    queryFn: async () => {
      const response = await fetch(
        `/api/token-holders?address=${tokenAddress}&chain=${chain}`
      );
      return response.json();
    },
    enabled: Boolean(tokenAddress),
  }) as {
    data: TokenHolderData[];
    isLoading: boolean;
    isRefetching: boolean;
  };

  useEffect(() => {
    if (!tokenId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const buyChannel = pusher.subscribe(Channel.Buy);
    const sellChannel = pusher.subscribe(Channel.Sell);

    [buyChannel, sellChannel].forEach((channel) => {
      channel.bind(tokenId, () => {
        queryClient.invalidateQueries({
          queryKey: ["tokenHolders", chain, tokenAddress],
        });
      });
    });

    return () => {
      buyChannel.unbind_all();
      sellChannel.unbind_all();
      pusher.disconnect();
    };
  }, [tokenAddress, chain, tokenId, queryClient]);

  return { holders };
}
