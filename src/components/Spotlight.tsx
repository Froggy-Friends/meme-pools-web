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
import { formatTicker } from "@/lib/formatTicker";
import { useChain } from "@/context/chain";
import Link from "next/link";

export default function Spotlight() {
  const payload = useFeatureFlagPayload("spotlight");
  const { token } = useToken(payload as string);
  const { chain } = useChain();
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
        <section className="relative overflow-hidden w-full h-[120px] laptop:w-[650px] tablet:h-[200px] flex flex-col p-4 mb-[70px] tablet:mb-24 -mt-[70px] tablet:-mt-24 tablet:p-8 bg-dark-gray rounded-xl">
          <div className="flex items-center justify-between mb-4 tablet:mb-6">
            <h3 className="text-2xl tablet:text-4xl">Spotlight</h3>
            <div className="flex items-center gap-x-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p>LIVE</p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-x-2 tablet:gap-x-4">
              <Link href={`${chain.name}/token/${token.tokenAddress}`}>
                <Image
                  src={token.image}
                  alt={token.name}
                  width={60}
                  height={60}
                  className="rounded-full hover:scale-[1.02] transition w-10 h-10 tablet:w-16 tablet:h-16"
                />
              </Link>

              <Link
                href={`${chain.name}/token/${token.tokenAddress}`}
                className="hidden tablet:block text-2xl font-proximaSoftBold text-white/80 hover:text-white transition tablet:mb-2"
              >
                ${token.ticker}
              </Link>
              <Link href={`${chain.name}/token/${token.tokenAddress}`} className="block tablet:hidden text-xl">
                ${formatTicker(token.ticker)}
              </Link>
            </div>

            {latestTrade && (
              <LiveFeedTradeNotification trade={latestTrade} isAnimating={isAnimating} spotlight={true} />
            )}
          </div>
        </section>
      )}
    </>
  );
}
