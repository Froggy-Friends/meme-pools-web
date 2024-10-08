import { Progress } from "@nextui-org/react";

type BondingCurveProgressProps = {
  ticker: string;
};

export default function BondingCurveProgress({ ticker }: BondingCurveProgressProps) {
  return (
    <section className="mt-6 w-full tablet:w-[350px]">
      <Progress
        aria-label="Downloading..."
        size="md"
        value={5}
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

      <p className="block laptop:hidden text-cream pt-4">
        When {ticker} reaches a market cap of $42,000, all of the liquidity from the bonding curve with be depositied
        into Uniswap and burned. Progression increases as the price goes up.
      </p>
    </section>
  );
}
