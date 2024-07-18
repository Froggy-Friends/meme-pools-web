import { Progress } from "@nextui-org/react";

export default function BondingCurveProgress() {
  return (
    <section className="mt-6 w-[350px]">
      <Progress
        aria-label="Downloading..."
        size="md"
        value={5}
        classNames={{
          base: "max-w-md",
          track: "drop-shadow-md border border-success",
          indicator: "bg-success",
          label: "tracking-wider font-small text-default-600",
          value: "text-foreground/60",
        }}
        showValueLabel={true}
        className="max-w-md pb-2"
        label="Bonding curve progress"
      />

      <p className="text-sm pb-1">
        When the market cap reaches $66,023 all the liquidity from the bonding
        curve will be deposited into Raydium and burned. progression increases
        as the price goes up.
      </p>
      <p className="text-sm">
        There are 788,764,011 tokens still available for sale in the bonding
        curve and there is 0.122 SOL in the bonding curve.
      </p>
    </section>
  );
}
