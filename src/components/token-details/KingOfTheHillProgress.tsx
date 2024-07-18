import { Progress } from "@nextui-org/react";

export default function KingOfTheHillProgress() {
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
        label="King of the hill progress"
      />

      <p className="text-sm pb-1">
        Dethrone the current king at a $31,902 mcap
      </p>
    </section>
  );
}
