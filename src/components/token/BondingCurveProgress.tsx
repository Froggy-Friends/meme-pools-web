"use client";

import { Progress } from "@nextui-org/react";
import { Token } from "@prisma/client";
import { getBondingCurvePercentage } from "@/lib/getBondingCurvePercentage";
import useTokenInfo from "@/hooks/useTokenInfo";
import useMarketcapGoal from "@/hooks/useMarketcapGoal";
import Link from "next/link";

type BondingCurveProgressProps = {
  token: Token;
};

export default function BondingCurveProgress({ token }: BondingCurveProgressProps) {
  const { tokenInfo } = useTokenInfo(token);
  const marketcapGoal = useMarketcapGoal();

  return (
    <section className="mt-6 laptop:mt-7 desktop:mt-4 w-full tablet:w-[350px]">
      <Progress
        aria-label="Downloading..."
        size="md"
        value={tokenInfo?.tokensSold ? getBondingCurvePercentage(tokenInfo.tokensSold) : 0}
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
        Marketcap: <span className="text-light-primary">${tokenInfo?.marketcap?.toFixed(2)}</span>
      </p>

      <p className="text-cream text-sm pt-2">
        When ${token.ticker} reaches a market cap of <span className="text-green">${marketcapGoal}</span>, launch it on
        your profile to collect your reward. All users start with bronze rewards. Own{" "}
        <Link
          href="https://magiceden.us/collections/ethereum/0x7ad05c1b87e93be306a9eadf80ea60d7648f1b6f"
          className="text-[#61A14C] hover:text-green transition"
          target="_blank"
        >
          Frogs
        </Link>{" "}
        to earn exclusive silver and gold tier rewards.
      </p>
    </section>
  );
}
