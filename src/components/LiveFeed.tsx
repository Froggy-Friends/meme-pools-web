"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FormattedTrade } from "@/types/token/types";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";

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
        <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
        <span className="font-proximaSoftBold">Live</span>
      </div>
      {latestTrade && <TradeNotification trade={latestTrade} isAnimating={isAnimating} />}
    </div>
  );
}

function TradeNotification({ trade, isAnimating }: { trade: FormattedTrade; isAnimating: boolean }) {
  return (
    <div
      className={`text-sm font-proximaSoft flex items-center gap-1 transition-all duration-500 ease-in-out ${
        isAnimating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
    >
      <Image
        src={trade.userAvatar || defaultProfileAvatarUrl}
        alt="user-profile-picture"
        height={16}
        width={16}
        className="rounded-full mr-1"
      />
      <span>{getUserDisplayName(trade.username)}</span>
      <span className="text-green">bought</span>
      <span className="text-cream">{trade.amount}</span>
      <span className="text-light-green">${trade.tokenTicker}</span>
    </div>
  );
}
