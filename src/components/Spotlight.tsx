"use client";

import useToken from "@/hooks/useToken";
import { Channel } from "@/models/channel";
import { FormattedTrade } from "@/types/token/types";
import Image from "next/image";
import { useEffect } from "react";
import { useFeatureFlagPayload } from "posthog-js/react";
import { useState } from "react";
import Pusher from "pusher-js";
import { LiveFeedTradeNotification } from "./LiveFeedTradeNotification";

export default function Spotlight() {
  const payload = useFeatureFlagPayload("spotlight");
  const { token } = useToken(payload as string);
  const [latestTrade, setLatestTrade] = useState<FormattedTrade | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!token) return;
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(Channel.Buy);

    channel.bind(token?.id, ({ trade }: { trade: FormattedTrade }) => {
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
      channel.unbind(token?.id);
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [latestTrade, token]);

  return (
    <>
      {payload && token && (
        <section className="w-full h-[140px] laptop:w-[750px] tablet:h-[200px] flex flex-col p-6 laptop:p-8 bg-dark-gray rounded-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl">Spotlight</h3>
            <div className="flex items-center gap-x-1">
              <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
              <p>Live</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Image src={token.image} alt={token.name} width={60} height={60} className="rounded-full" />
              <div className="flex flex-col">
                <p className="text-4xl font-proximaSoftBold mb-2">${token.ticker}</p>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/90">{token.description}</p>
                  {latestTrade && <LiveFeedTradeNotification trade={latestTrade} isAnimating={isAnimating} />}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
