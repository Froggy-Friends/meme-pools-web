"use client";

import { useChain } from "@/context/chain";
import useIsMounted from "@/hooks/useIsMounted";
import { TokenWithCreator } from "@/lib/types";
import { Channel } from "@/models/channel";
import { TokenWithVotes, TradeWithUserAndToken } from "@/types/token/types";
import Image from "next/image";
import Link from "next/link";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { CiGlobe } from "react-icons/ci";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Progress } from "@nextui-org/react";
import { getBondingCurvePercentage } from "@/lib/getBondingCurvePercentage";
import useTokenInfo from "@/hooks/useTokenInfo";
import { formatMarketcap } from "@/lib/formatMarketcap";
import { defaultProfileAvatarUrl } from "@/config/user";

type TokenDisplayCardProps = {
  token: TokenWithCreator | TokenWithVotes;
};

export default function TokenDisplayCard({ token }: TokenDisplayCardProps) {
  const { chain } = useChain();
  const { tokenInfo } = useTokenInfo(token);
  const [newTrade, setNewTrade] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const buyChannel = pusher.subscribe(Channel.Buy);

    buyChannel.bind(token.id, async ({ trade }: { trade: TradeWithUserAndToken }) => {
      if (trade) {
        setNewTrade(true);
        setTimeout(() => setNewTrade(false), 1000);
      }
    });

    return () => {
      buyChannel.unbind();
      pusher.disconnect();
    };
  }, [token.id, token.tokenAddress]);

  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden bg-dark-gray h-[320px] min-w-[175px] max-w-[195px] tablet:w-[220px] tablet:min-w-[220px] ${
        newTrade ? "animate-primaryPulse" : ""
      }`}
    >
      <Link href={`/${chain.name}/token/${token.tokenAddress}`}>
        <div className="h-[160px] min-h-[160px]">
          <Image
            src={token.image}
            alt={token.name}
            width={220}
            height={160}
            className="w-full h-full object-cover border-b-2 border-dark border-dotted"
          />
        </div>
      </Link>
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex flex-col px-3 mt-3">
          <Link href={`/${chain.name}/token/${token.tokenAddress}`}>
            <div className="flex items-center gap-1 laptop:gap-2.5">
              <span className="bg-primary rounded-[4px] text-xs font-bold text-black px-2 py-1 max-w-[150px] truncate hover:bg-light-primary transition">
                ${token.ticker}
              </span>
              <span className="text-white/75 hover:text-white transition truncate max-w-[100px] tablet:max-w-[130px]">
                {token.name}
              </span>
            </div>
          </Link>
        </div>

        <div className="px-3 mt-2">
          <div className="flex flex-start gap-2">
            <Link href={`/profile/${token.user.name}`} className="text-light-primary hover:text-cream transition">
              <Image
                src={token.user.imageUrl || defaultProfileAvatarUrl}
                alt="token-image"
                height={25}
                width={25}
                className="rounded-full shrink-0 min-w-[25px] min-h-[25px] self-start"
              />
            </Link>
            <p className="text-light-gray text-sm break-words line-clamp-3">
              {token.description}
            </p>
          </div>
        </div>

        <div className="px-3 pb-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="text-white text-sm flex items-center gap-1">
              MC
              <span>${formatMarketcap(tokenInfo?.marketcap || 0)}</span>
              <span className="text-light-gray">({Math.round(getBondingCurvePercentage(tokenInfo?.tokensSold))}%)</span>
            </div>
            <div className="flex items-center gap-3">
              {token.twitter && (
                <a href={token.twitter} target="_blank">
                  <FaXTwitter className="text-light-gray hover:text-white transition" width={12} height={12} />
                </a>
              )}
              {token.website && (
                <a href={token.website} target="_blank">
                  <CiGlobe className="text-light-gray hover:text-white transition" width={12} height={12} />
                </a>
              )}
              {token.telegram && (
                <a href={token.telegram} target="_blank">
                  <FaTelegramPlane className="text-light-gray hover:text-white transition" width={12} height={12} />
                </a>
              )}
            </div>
          </div>
          <Progress
            aria-label="Downloading..."
            size="md"
            value={getBondingCurvePercentage(tokenInfo?.tokensSold)}
            classNames={{
              base: "max-w-full",
              track: "drop-shadow-md bg-gray h-2",
              indicator: "bg-primary",
              label: "tracking-wider font-small text-light-gray",
              value: "text-foreground/60 text-gray",
            }}
            className="max-w-md mt-1"
          />
        </div>
      </div>
    </div>
  );
}
