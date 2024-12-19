"use client";

import { useChain } from "@/context/chain";
import { formatTicker } from "@/lib/formatTicker";
import { cn, Link } from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import presentIcon from "../../../public/present.svg";
import { Token } from "@prisma/client";
import useClaimRewards from "@/hooks/useClaimRewards";
import useRewards from "@/hooks/useRewards";
import { Address } from "viem";
import { formatNumber } from "@/lib/formatNumber";
import { Chain } from "@/models/chain";
import { ethLogo, baseLogo } from "@/config/chains";

type CreatedCoinCardProps = {
  token: Token;
  enabled: boolean;
  isClaimed: boolean;
};

export default function CreatedCoinCard({ token, enabled, isClaimed }: CreatedCoinCardProps) {
  const { chain } = useChain();
  const [isRevealed, setIsRevealed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [rewards, setRewards] = useState("0");
  const { fetchRewards, pending } = useRewards();
  const { claimBatch } = useClaimRewards(token.chain as Chain);

  return (
    <section className="flex flex-row items-center justify-between bg-dark rounded-xl p-4 tablet:p-6 gap-4">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-x-2 tablet:gap-x-4 mr-4 relative">
          <Image
            src={token.image}
            alt={token.name}
            width={50}
            height={50}
            className="rounded-full h-[50px] w-[50px] object-cover"
          />
          <Image
            src={token.chain === "eth" ? ethLogo : baseLogo}
            alt={`${token.chain} logo`}
            width={20}
            height={20}
            className="rounded-full h-[20px] w-[20px] object-cover absolute top-8 left-8 ring-4 ring-dark"
          />
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
                onClick={async () => {
                  setIsRevealed(true);
                  const rewards = await fetchRewards(token.tokenAddress as Address);
                  setRewards(rewards.toString());
                }}
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
                isRevealed && !pending ? `${formatNumber(rewards)} $${formatTicker(token.ticker)}` : "*************"
              }`}</p>
            </div>
          </div>
        </div>

        <button
          disabled={!enabled || isClaimed}
          onClick={async () => {
            setIsClaiming(true);
            await claimBatch(token.tokenAddress, token.ticker);
            setIsClaiming(false);
          }}
          className={cn(
            `bg-gray text-black font-bold rounded-xl px-6 tablet:px-8 py-[0.125rem] max-w-[100px] tablet:py-1 hover:cursor-default active:scale-[0.98] transition`,
            enabled && !isClaimed && !isClaiming && "bg-primary hover:cursor-pointer hover:bg-light-primary transition",
            isClaiming && "bg-gray px-[0.625rem] tablet:px-4 hover:cursor-default"
          )}
        >
          {isClaiming ? "Claiming.." : "Claim"}
        </button>
      </div>
    </section>
  );
}
