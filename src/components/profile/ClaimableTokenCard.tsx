"use client";

import { useChain } from "@/context/chain";
import useLaunchCoin from "@/hooks/useLaunchCoin";
import { formatTicker } from "@/lib/formatTicker";
import { ClaimableToken } from "@/types/token/types";
import { cn, Link } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import presentIcon from "../../../public/present.svg";

type CreatedCoinCardProps = {
  token: ClaimableToken;
  enabled: boolean;
};

export default function CreatedCoinCard({ token, enabled }: CreatedCoinCardProps) {
  const { launchCoin } = useLaunchCoin();
  const { chain } = useChain();
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <section className="flex flex-row items-center justify-between bg-dark rounded-xl p-4 tablet:p-6 gap-4">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-x-2 tablet:gap-x-4 mr-4">
          <Image src={token.image} alt={token.name} width={50} height={50} className="rounded-full" />
          <div className="flex flex-col">
            <Link
              href={`/${chain.name}/token/${token.tokenAddress}`}
              className="text-xl text-white hover:text-light-primary transition"
            >
              ${formatTicker(token.ticker)}
            </Link>

            <div className="flex items-center gap-x-1">
              <button
                disabled={isRevealed}
                onClick={() => setIsRevealed(true)}
                className={cn(
                  "text-light-gray text-[13px] tablet:text-base transition",
                  !isRevealed && "hover:text-cream"
                )}
              >
                <Image
                  src={presentIcon}
                  alt="present"
                  width={16}
                  height={16}
                  className={cn("transition-transform duration-1000", !isRevealed && "animate-pulseScale")}
                />
              </button>
              <p className="text-xs tablet:text-sm text-light-gray">{`${
                isRevealed ? `${token.tokensClaimable} ${formatTicker(token.ticker)}` : "*************"
              }`}</p>
            </div>
          </div>
        </div>

        <button
          disabled={!enabled}
          onClick={() => launchCoin(token.tokenAddress)}
          className={cn(
            `bg-gray text-black font-bold rounded-xl px-6 tablet:px-8 py-[0.125rem] tablet:py-1 hover:cursor-default`,
            token.tokensClaimable > 0 && enabled && "bg-primary hover:cursor-pointer hover:bg-light-primary transition"
          )}
        >
          Claim
        </button>
      </div>
    </section>
  );
}
