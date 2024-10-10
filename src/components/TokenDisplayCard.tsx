"use client";

import { useChain } from "@/context/chain";
import useTokenMarketcap from "@/hooks/useTokenMarketcap";
import useIsMounted from "@/hooks/useIsMounted";
import { MAX_MARKET_CAP } from "@/lib/constants";
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
import { getMarketcapPercentage } from "@/lib/getMarketcapPercentage";

type TokenDisplayCardProps = {
  token: TokenWithCreator | TokenWithVotes;
};

export default function TokenDisplayCard({ token }: TokenDisplayCardProps) {
  const { chain } = useChain();
  const { getTokenMarketcap } = useTokenMarketcap();
  const [newTrade, setNewTrade] = useState(false);
  const [marketCap, setMarketCap] = useState(token.marketCap);
  const [marketCapPercentage, setMarketCapPercentage] = useState(getMarketcapPercentage(token.marketCap));
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const buyChannel = pusher.subscribe(Channel.Buy); 
    const sellChannel = pusher.subscribe(Channel.Sell);

    buyChannel.bind(token.id, async ({ trade }: { trade: TradeWithUserAndToken }) => {
      if (trade) {
        setNewTrade(true);
        setTimeout(() => setNewTrade(false), 1000);
      }

      const marketCap = await getTokenMarketcap(token.tokenAddress);
      setMarketCap(marketCap);
      setMarketCapPercentage(getMarketcapPercentage(marketCap));
    });

    sellChannel.bind(token.id, async ({ trade }: { trade: TradeWithUserAndToken }) => {
      const marketCap = await getTokenMarketcap(token.tokenAddress);
      setMarketCap(marketCap);
      setMarketCapPercentage(getMarketcapPercentage(marketCap));
    });
  }, [token.id, token.tokenAddress, getTokenMarketcap]);

  if (!isMounted) return null;

  return (
    <div
      className={`flex flex-col rounded-xl overflow-hidden bg-dark-gray h-[320px] min-w-[175px] max-w-[195px] tablet:w-[220px] tablet:min-w-[220px] ${
        newTrade ? "animate-greenPulse" : ""
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
              <span className="text-white/75 hover:text-white transition">{token.name}</span>
              <span className="bg-green rounded-[4px] text-xs text-black px-2 py-1 hover:bg-light-green transition">
                ${token.ticker}
              </span>
            </div>
          </Link>

          <div className="flex items-center overflow-hidden gap-1 text-xs my-2">
            <span className="block w-max">Created by:</span>
            <Link
              href={`/profile/${token.user.name}`}
              className="text-light-green truncate overflow-hidden block w-1/2 underline"
            >
              {token.user.name}
            </Link>
          </div>
        </div>

        <p className="flex-grow overflow-y-auto text-light-gray px-3 mb-1">{token.description}</p>

        <div className="px-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="text-light-gray text-[10px] flex items-center gap-1">
              Market Cap:
              <span className="text-white">${marketCap.toFixed(2)}</span> ({marketCapPercentage}%)
            </div>
            <div className="flex items-center gap-3">
              {token.twitter && (
                <a href={token.twitter} target="_blank">
                  <FaXTwitter className="text-light-gray" width={12} height={12} />
                </a>
              )}
              {token.website && (
                <a href={token.website} target="_blank">
                  <CiGlobe className="text-light-gray" width={12} height={12} />
                </a>
              )}
              {token.telegram && (
                <a href={token.telegram} target="_blank">
                  <FaTelegramPlane className="text-light-gray" width={12} height={12} />
                </a>
              )}
            </div>
          </div>
          <Progress
            aria-label="Downloading..."
            size="md"
            value={Number(marketCapPercentage)}
            classNames={{
              base: "max-w-full",
              track: "drop-shadow-md bg-gray h-2",
              indicator: "bg-green",
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
