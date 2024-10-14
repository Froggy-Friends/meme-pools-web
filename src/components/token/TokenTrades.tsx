"use client";

import TokenTrade from "./TokenTrade";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Channel } from "@/models/channel";
import { FormattedTrade } from "@/types/token/types";
import { usePostHog } from "posthog-js/react";
import Pusher from "pusher-js";

type TokenTradesProps = {
  trades: FormattedTrade[];
  tokenId: string;
  tokenAddress: string;
};

export default function TokenTrades({ trades, tokenId, tokenAddress }: TokenTradesProps) {
  const queryClient = useQueryClient();
  const posthog = usePostHog();

  const { data } = useQuery({
    queryKey: ["trades", tokenId],
    initialData: trades,
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channels = Object.values(Channel);

    const subscribedChannels = channels.map(channelName => {
      if (channelName === Channel.Buy) {
        return pusher.subscribe(Channel.Buy);
      } else if (channelName === Channel.Sell) {
        return pusher.subscribe(Channel.Sell);
      }
    });

    subscribedChannels.forEach(channel => {
      channel?.bind(tokenId, ({ trade }: { trade: FormattedTrade }) => {
        queryClient.setQueryData(["trades", tokenId], [{ ...trade, isNew: true }, ...data]);

        if (channel?.name === Channel.Buy) {
          posthog.capture("token_bought", { tokenId: tokenId, trade: trade });
        } else if (channel?.name === Channel.Sell) {
          posthog.capture("token_sold", { tokenId: tokenId, trade: trade });
        }
      });
    });

    return () => {
      subscribedChannels.forEach(channel => {
        channel?.unbind_all();
        channel?.unsubscribe();
      });
      pusher.disconnect();
    };
  }, [queryClient, tokenId, data, posthog, tokenAddress]);

  return (
    <section className="flex flex-col">
      {data.map(trade => (
        <TokenTrade key={trade.id} trade={trade} />
      ))}
    </section>
  );
}
