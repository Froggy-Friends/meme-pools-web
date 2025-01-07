"use client";

import { Link, Progress } from "@nextui-org/react";
import { Token } from "@prisma/client";
import { getBondingCurvePercentage } from "@/lib/getBondingCurvePercentage";
import useTokenInfo from "@/hooks/useTokenInfo";
import useMarketcapGoal from "@/hooks/useMarketcapGoal";
import { Address } from "viem";
import { Chain } from "@/models/chain";
import { useChain } from "@/context/chain";
import useLaunchedCoinMc from "@/hooks/useLaunchedCoinMc";
import { getDexName } from "@/lib/chains";

type BondingCurveProgressProps = {
  token: Token;
};

export default function BondingCurveProgress({ token }: BondingCurveProgressProps) {
  const { tokenInfo } = useTokenInfo(token);
  const { chain } = useChain();
  const marketcapGoal = useMarketcapGoal(token.platformAddress as Address, chain.name);
  const launchedCoinMarketcap = useLaunchedCoinMc(token);

  return (
    <section className="mt-6 laptop:mt-7 desktop:mt-4 w-full tablet:w-[430px]">
      <Progress
        aria-label="Downloading..."
        size="md"
        value={tokenInfo?.tokensSold ? getBondingCurvePercentage(tokenInfo.tokensSold, token.chain as Chain) : 0}
        classNames={{
          base: "max-w-full",
          track: "drop-shadow-md bg-dark-gray h-4",
          indicator: "bg-light-primary",
          label: "tracking-wider font-small text-light-gray",
          value: "text-foreground/60 text-gray",
        }}
        showValueLabel={true}
        className="max-w-md pb-2"
        label="Launch Progress"
      />
      <p className="text-light-gray">
        Marketcap:{" "}
        <span className="text-light-primary">${launchedCoinMarketcap || tokenInfo?.marketcap?.toFixed(2)}</span>
      </p>

      {tokenInfo?.liquidityPoolSeeded ? (
        <p className="text-cream pt-2">
          ${token.ticker} has been launched and trading is available on {getDexName(chain.name)}
        </p>
      ) : tokenInfo?.autoLaunch ? (
        <p className="text-cream pt-2">
          ${token.ticker} will be launched and trading enabled on dexes once it reaches a market cap of{" "}
          <span className="text-green">${marketcapGoal}</span>.
        </p>
      ) : (
        <p className="text-cream pt-2">
          The creator can launch ${token.ticker} and enable trading on dexes once it reaches a market cap of{" "}
          <span className="text-green">${marketcapGoal}</span>.
        </p>
      )}
    </section>
  );
}
