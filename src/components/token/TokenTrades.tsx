"use client";

import TokenTrade from "./TokenTrade";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Channel } from "@/models/channel";
import { FormattedTrade } from "@/types/token/types";
import { usePostHog } from "posthog-js/react";
import usePusher from "@/hooks/usePusher";
import { Trade } from "@/models/trade";

type TokenTradesProps = {
  trades: FormattedTrade[];
  tokenId: string;
  tokenAddress: string;
};

export default function TokenTrades({ trades, tokenId }: TokenTradesProps) {
  const queryClient = useQueryClient();
  const posthog = usePostHog();

  const { data } = useQuery({
    queryKey: ["trades", tokenId],
    initialData: trades,
  });

  const handleTrade = ({ trade }: { trade: FormattedTrade }) => {
    queryClient.setQueryData(["trades", tokenId], [{ ...trade, isNew: true }, ...data]);

    if (trade.category === Trade.Buy) {
      posthog.capture("token_bought", { tokenId: tokenId, trade: trade });
    } else if (trade.category === Trade.Sell) {
      posthog.capture("token_sold", { tokenId: tokenId, trade: trade });
    }
  };

  usePusher(tokenId, handleTrade, [Channel.Buy, Channel.Sell]);

  return (
    <section className="flex flex-col">
      {data.map(trade => (
        <TokenTrade key={trade.id} trade={trade} />
      ))}
    </section>
  );
}
