"use client";

import { useChain } from "@/context/chain";
import useTokenInfo from "@/hooks/useTokenInfo";
import { formatBalance } from "@/lib/formatBalance";
import { formatMarketcap } from "@/lib/formatMarketcap";
import { formatTicker } from "@/lib/formatTicker";
import { getBondingCurvePercentage } from "@/lib/getBondingCurvePercentage";
import { TokenWithBalance } from "@/types/token/types";
import { cn, Link, Progress } from "@nextui-org/react";
import Image from "next/image";
import { getChainLogo } from "@/lib/chains";
import { Chain } from "@/models/chain";

type PurchasedCoinCardProps = {
  token: TokenWithBalance;
  enabled: boolean;
};

export default function PurchasedCoinCard({ token }: PurchasedCoinCardProps) {
  const { tokenInfo } = useTokenInfo(token);
  const { chain } = useChain();
  const bondingCurvePercentage = getBondingCurvePercentage(tokenInfo?.tokensSold);

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
            src={getChainLogo(token.chain as Chain)}
            alt={`${token.chain} logo`}
            width={20}
            height={20}
            className="rounded-full h-[20px] w-[20px] object-cover absolute top-8 left-8 ring-4 ring-dark"
          />
          <div>
            <Link
              href={`/${chain.name}/token/${token.tokenAddress}`}
              className="text-xl text-white hover:text-light-primary transition"
            >
              ${formatTicker(token.ticker)}
            </Link>
            <p className="text-sm text-white/75">${formatMarketcap(tokenInfo?.marketcap || 0)} MC</p>
          </div>
        </div>

        <div className="tablet:hidden flex w-full justify-end">
          <div className="flex flex-col items-center">
            <p className="text-sm text-light-gray">Balance</p>
            <p className="text-sm">{formatBalance(token.balance)}</p>
          </div>
        </div>
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

      <div className="hidden tablet:flex tablet:w-[100px] justify-center tablet:justify-end">
        <div className="flex flex-col items-center">
          <p className="text-light-gray">Balance</p>
          <p>{formatBalance(token.balance)}</p>
        </div>
      </div>
    </section>
  );
}
