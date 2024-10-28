"use client";

import { useEffect, useState } from "react";
import { FormattedTrade } from "@/types/token/types";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";
import { LiveFeedTradeNotification } from "./LiveFeedTradeNotification";

export default function LiveFeed() {
  const [latestTrade, setLatestTrade] = useState<FormattedTrade | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(Channel.Buy);

    channel.bind_global((eventName: string, data: { feedData: any; trade: FormattedTrade }) => {
      const trade = data.trade as FormattedTrade;
      if (!trade) return;
      setIsAnimating(true);

      if (!latestTrade) {
        setLatestTrade(trade);
      } else {
        setTimeout(() => {
          setLatestTrade(trade);
        }, 350);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [latestTrade]);

  return (
    <div className="w-full laptop:min-w-[350px] laptop:w-[350px] rounded-lg bg-dark-gray flex items-center justify-between p-4">
      <div className="flex items-center gap-x-1">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-allumiBold">LIVE</span>
      </div>
      {latestTrade && <LiveFeedTradeNotification trade={latestTrade} isAnimating={isAnimating} />}
    </div>
  );
}
