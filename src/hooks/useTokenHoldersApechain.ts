import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTokenHoldersApechain } from "@/queries/token/queries";
import { Channel } from "@/models/channel";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { Chain } from "@/models/chain";

export default function useTokenHoldersApechain(tokenId: string, chain: Chain) {
  const queryClient = useQueryClient();
  const { data: holdersApechain } = useQuery({
    queryKey: ["tokenHoldersApechain", tokenId],
    queryFn: async () => await getTokenHoldersApechain(tokenId),
    enabled: chain === Chain.ApeChain,
  });

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
          queryKey: ["tokenHoldersApechain", tokenId],
        });
      });
    });

    return () => {
      buyChannel.unbind_all();
      sellChannel.unbind_all();
      pusher.disconnect();
    };
  }, [tokenId, queryClient]);

  return { holdersApechain };
}
