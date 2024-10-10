"use client";

import useTokenMarketcap from "@/hooks/useTokenMarketcap";
import { Progress } from "@nextui-org/react";
import { Token } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { MAX_MARKET_CAP } from "@/lib/constants";

type BondingCurveProgressProps = {
  token: Token;
};

export default function BondingCurveProgress({ token }: BondingCurveProgressProps) {
  const { getTokenMarketcap } = useTokenMarketcap();
  const { data } = useQuery({
    queryKey: ["tokenMarketcap", token.id],
    queryFn: () => getTokenMarketcap(token.tokenAddress),
  });

  return (
    <section className="mt-6 w-full tablet:w-[350px]">
      <Progress
        aria-label="Downloading..."
        size="md"
        value={data ? (data / MAX_MARKET_CAP) * 100 : 0}
        classNames={{
          base: "max-w-full",
          track: "drop-shadow-md bg-dark-gray h-4",
          indicator: "bg-light-green",
          label: "tracking-wider font-small text-light-gray",
          value: "text-foreground/60 text-gray",
        }}
        showValueLabel={true}
        className="max-w-md pb-2"
        label="Bonding Curve Progress"
      />
      <p className="text-light-gray">
        Marketcap: <span className="text-light-green">${data?.toFixed(2)}</span>
      </p>

      <p className="block laptop:hidden text-cream pt-4">
        When {token.ticker} reaches a market cap of $42,000, all of the liquidity from the bonding curve with be
        depositied into Uniswap and burned. Progression increases as the price goes up.
      </p>
    </section>
  );
}
