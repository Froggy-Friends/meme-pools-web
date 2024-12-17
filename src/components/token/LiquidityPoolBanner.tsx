"use client";

import { useChain } from "@/context/chain";
import useTokenInfo from "@/hooks/useTokenInfo";
import { Channel } from "@/models/channel";
import { Token } from "@prisma/client";
import Link from "next/link";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

type LiquidityPoolBannerProps = {
  token: Token;
};

export default function LiquidityPoolBanner({ token }: LiquidityPoolBannerProps) {
  const { tokenInfo } = useTokenInfo(token);
  const { chain } = useChain();
  const [readyForLp, setReadyForLp] = useState(false);

  useEffect(() => {
    if (tokenInfo?.readyForLp !== undefined) {
      setReadyForLp(tokenInfo.readyForLp);
    }
  }, [tokenInfo?.readyForLp]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(Channel.ReadyForLp);

    channel.bind(token.id, ({ readyForLp }: { readyForLp: boolean }) => {
      setReadyForLp(readyForLp);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [token.id]);

  return (
    <>
      {readyForLp && (
        <section className="w-full h-12 tablet:h-20 mb-8 tablet:mb-12 flex items-center justify-center bg-primary rounded-lg tablet:text-3xl">
          {tokenInfo?.liquidityPoolSeeded ? (
            <p className="text-black flex items-center gap-x-2">
              All coins sold, trade now on {chain.name === "solana" ? "Raydium" : "Uniswap"}
              <Link
                href={
                  chain.name === "solana"
                    ? `https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=${token.tokenAddress}`
                    : `https://app.uniswap.org/explore/tokens/${chain.name === "eth" ? "ethereum" : chain.name}/${
                        token.tokenAddress
                      }`
                }
                target="_blank"
                className="text-black hover:text-dark hover:scale-[1.04] transition"
              >
                <FaExternalLinkAlt size={20} className="mt-1" />
              </Link>
            </p>
          ) : (
            <p className="text-black">All coins sold, liquidity pool coming soon!</p>
          )}
        </section>
      )}
    </>
  );
}
