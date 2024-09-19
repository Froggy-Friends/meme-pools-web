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
          track: "drop-shadow-md bg-dark-gray h-4",
          indicator: "bg-light-green",
          label: "tracking-wider font-small text-light-gray",
          value: "text-foreground/60 text-gray",
        }}
        showValueLabel={true}
        className="max-w-md pb-2"
        label="Bonding Curve Progress"
      />
    </section>
  );
}
