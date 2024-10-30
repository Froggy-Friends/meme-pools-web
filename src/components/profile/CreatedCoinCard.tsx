"use client";

import { useChain } from "@/context/chain";
import useLaunchCoin from "@/hooks/useLaunchCoin";
import useTokenInfo from "@/hooks/useTokenInfo";
import { formatNumber } from "@/lib/format";
import { formatTicker } from "@/lib/formatTicker";
import { getBondingCurvePercentage } from "@/lib/getBondingCurvePercentage";
import { cn, Link, Progress } from "@nextui-org/react";
import { Token } from "@prisma/client";
import Image from "next/image";

type CreatedCoinCardProps = {
  token: Token;
  enabled: boolean;
};

export default function CreatedCoinCard({ token, enabled }: CreatedCoinCardProps) {
  const { tokenInfo } = useTokenInfo(token);
  const { launchCoin } = useLaunchCoin();
  const { chain } = useChain();
  const bondingCurvePercentage = getBondingCurvePercentage(tokenInfo?.tokensSold);

  return (
    <section className="flex flex-col tablet:flex-row items-center justify-between bg-dark rounded-xl p-4 gap-4">
      <div className="flex justify-between w-full tablet:w-[200px] tablet:justify-start items-center">
        <div className="flex gap-x-4 mr-4">
          <Image src={token.image} alt={token.name} width={50} height={50} className="rounded-full" />
          <div>
            <Link
              href={`${chain.name}/token/${token.tokenAddress}`}
              className="text-xl text-white hover:underline transition"
            >
              ${formatTicker(token.ticker)}
            </Link>
            <p className="text-sm text-white/75">${formatNumber(Math.round(tokenInfo?.marketcap || 0))} MC</p>
          </div>
        </div>

        <button
          disabled={!enabled}
          onClick={() => launchCoin(token.tokenAddress)}
          className={cn(
            `tablet:hidden bg-gray text-black font-bold rounded-xl px-5 h-8 hover:cursor-default`,
            bondingCurvePercentage === 100 && enabled && "bg-green hover:cursor-pointer hover:bg-light-green transition"
          )}
        >
          Launch
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
            indicator: "bg-green",
            label: "tracking-wider font-small text-light-gray text-center",
            value: "text-foreground/60 text-gray text-center",
          }}
          showValueLabel={true}
          label="Progress"
        />
      </div>

      <div className="hidden tablet:flex w-full tablet:w-[200px] justify-center tablet:justify-end">
        <button
          disabled={!enabled}
          onClick={() => launchCoin(token.tokenAddress)}
          className={cn(
            `bg-gray text-black font-bold rounded-xl px-8 py-1 hover:cursor-default`,
            bondingCurvePercentage === 100 && enabled && "bg-green hover:cursor-pointer hover:bg-light-green transition"
          )}
        >
          Launch
        </button>
      </div>
    </section>
  );
}
