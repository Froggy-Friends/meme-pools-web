"use client";

import useTokenMarketcap from "@/hooks/useTokenMarketcap";
import { Progress } from "@nextui-org/react";
import { Token } from "@prisma/client";
import { getMarketcapPercentage } from "@/lib/getMarketcapPercentage";

type BondingCurveProgressProps = {
  token: Token;
};

export default function BondingCurveProgress({ token }: BondingCurveProgressProps) {
  const { tokenMarketcap } = useTokenMarketcap(token);

  return (
    <section className="mt-6 laptop:mt-7 desktop:mt-6 w-full tablet:w-[350px]">
      <Progress
        aria-label="Downloading..."
        size="md"
        value={tokenMarketcap ? Number(getMarketcapPercentage(tokenMarketcap)) : 0}
        classNames={{
          base: "max-w-full",
          track: "drop-shadow-md bg-dark-gray h-4",
          indicator: "bg-light-primary",
          label: "tracking-wider font-small text-light-gray",
          value: "text-foreground/60 text-gray",
        }}
        showValueLabel={true}
        className="max-w-md pb-2"
        label="Bonding Curve Progress"
      />
      <p className="text-light-gray">
        Marketcap: <span className="text-light-primary">${tokenMarketcap?.toFixed(2)}</span>
      </p>

      <p className="text-cream text-sm pt-2">
        When {token.ticker} reaches a market cap of $42,000, all of the liquidity from the bonding curve with be
        depositied into Uniswap and burned. Progression increases as the price goes up.
      </p>
    </section>
  );
}
