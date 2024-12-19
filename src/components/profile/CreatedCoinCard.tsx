"use client";

import { useChain } from "@/context/chain";
import useLaunchCoin from "@/hooks/useLaunchCoin";
import useTokenInfo from "@/hooks/useTokenInfo";
import { formatMarketcap } from "@/lib/formatMarketcap";
import { formatTicker } from "@/lib/formatTicker";
import { getBondingCurvePercentage } from "@/lib/getBondingCurvePercentage";
import { cn, Link, Progress } from "@nextui-org/react";
import { Token } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { ethLogo, baseLogo } from "@/config/chains";

type CreatedCoinCardProps = {
  token: Token;
  enabled: boolean;
};

export default function CreatedCoinCard({ token, enabled }: CreatedCoinCardProps) {
  const { tokenInfo, refetchTokenInfo } = useTokenInfo(token);
  const { launchCoin } = useLaunchCoin(token);
  const { chain } = useChain();
  const bondingCurvePercentage = getBondingCurvePercentage(tokenInfo?.tokensSold);
  const [isLaunching, setIsLaunching] = useState(false);

  return (
    <section className="flex flex-col tablet:flex-row items-center justify-between bg-dark rounded-xl p-4 tablet:p-6 gap-4">
      <div className="flex justify-between w-full tablet:w-[200px] tablet:justify-start items-center">
        <div className="flex gap-x-4 mr-4 relative">
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
          <div>
            <Link
              href={`/${chain.name}/token/${token.tokenAddress}`}
              className="text-base tablet:text-xl text-white hover:text-light-primary transition"
            >
              ${formatTicker(token.ticker)}
            </Link>
            <p className="text-sm text-white/75">${formatMarketcap(tokenInfo?.marketcap || 0)} MC</p>
          </div>
        </div>

        <button
          disabled={!enabled}
          onClick={async () => {
            setIsLaunching(true);
            await launchCoin(token.tokenAddress, token.ticker, token.id);
            await refetchTokenInfo();
            setIsLaunching(false);
          }}
          className={cn(
            `tablet:hidden bg-gray text-black font-bold rounded-xl px-5 h-8 max-w-[90px] hover:cursor-default active:scale-[0.98] transition`,
            bondingCurvePercentage === 100 &&
              enabled &&
              !isLaunching &&
              !tokenInfo?.autoLaunch &&
              !tokenInfo?.liquidityPoolSeeded &&
              "bg-green hover:cursor-pointer hover:bg-light-green transition",
            isLaunching && "bg-gray px-2 hover:cursor-default"
          )}
        >
          {isLaunching ? "Launching.." : "Launch"}
        </button>
      </div>

      <div className="flex-1 w-full tablet:max-w-sm tablet:mx-auto -mt-2">
        <Progress
          aria-label="Downloading..."
          size="md"
          value={bondingCurvePercentage}
          classNames={{
            base: "w-full",
            track: "drop-shadow-md bg-gray h-2",
            indicator: "bg-primary",
            label: "tracking-wider font-small text-light-gray text-center",
            value: "text-foreground/60 text-gray text-center",
          }}
          showValueLabel={true}
          label="Launch Progress"
        />
      </div>

      <div className="hidden tablet:flex w-full tablet:w-[200px] justify-center tablet:justify-end">
        <button
          disabled={!enabled}
          onClick={async () => {
            setIsLaunching(true);
            await launchCoin(token.tokenAddress, token.ticker, token.id);
            await refetchTokenInfo();
            setIsLaunching(false);
          }}
          className={cn(
            `bg-gray text-black font-bold rounded-xl px-8 py-1 max-w-[140px] hover:cursor-default active:scale-[0.98] transition`,
            bondingCurvePercentage === 100 &&
              enabled &&
              !tokenInfo?.autoLaunch &&
              !isLaunching &&
              !tokenInfo?.liquidityPoolSeeded &&
              "bg-green hover:cursor-pointer hover:bg-light-green transition",
            isLaunching && "bg-gray px-[18px] hover:cursor-default"
          )}
        >
          {isLaunching ? "Launching.." : "Launch"}
        </button>
      </div>
    </section>
  );
}
