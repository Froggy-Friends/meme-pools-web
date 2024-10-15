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
        <section className="relative overflow-hidden w-full h-[140px] laptop:w-[750px] tablet:h-[200px] flex flex-col p-4 laptop:p-8 bg-dark-gray rounded-xl">
          <div className="flex items-center justify-between mb-4 tablet:mb-6">
            <h3 className="text-2xl">Spotlight</h3>
            <div className="flex items-center gap-x-1">
              <div className="w-2 h-2 rounded-full bg-green animate-pulse" />
              <p>Live</p>
            </div>
          </div>

          <div className="flex items-center w-full">
            <div className="flex gap-x-2 tablet:gap-x-4">
              <div className="self-start">
                <Link href={`${chain.name}/token/${token.tokenAddress}`}>
                  <Image
                    src={token.image}
                    alt={token.name}
                    width={60}
                    height={60}
                    className="rounded-full hover:scale-[1.02] transition"
                  />
                </Link>
              </div>

              <div className="flex flex-col w-full">
                <Link
                  href={`${chain.name}/token/${token.tokenAddress}`}
                  className="hidden tablet:block tablet:text-4xl font-proximaSoftBold text-white/80 hover:text-white transition tablet:mb-2"
                >
                  ${token.ticker}
                </Link>
                <Link
                  href={`${chain.name}/token/${token.tokenAddress}`}
                  className="block tablet:hidden text-2xl text-white/80 hover:text-white transition"
                >
                  ${formatTicker(token.ticker)}
                </Link>

                <p className="hidden tablet:block text-sm text-white/90 max-w-[55%] max-h-[45px] overflow-y-hidden">
                  {token.description}
                </p>
                <p className="block tablet:hidden -mt-1 text-sm text-white/90 max-w-[90%] max-h-[45px] overflow-hidden whitespace-nowrap text-ellipsis">
                  {token.description}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute right-4 tablet:right-8 bottom-[28px] tablet:bottom-[50px]">
            {latestTrade && (
              <LiveFeedTradeNotification trade={latestTrade} isAnimating={isAnimating} spotlight={true} />
            )}
          </div>
        </section>
      )}
    </>
  );
}
