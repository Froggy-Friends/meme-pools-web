"use client";

import { useChain } from "@/context/chain";
import { Chain } from "@/models/chain";

type RewardTierProps = {
  tier: string;
  rewardAmount: number;
};

export default function RewardTier({ tier, rewardAmount }: RewardTierProps) {
  const { chain } = useChain();

  return (
    <div className="flex flex-col gap-y-1 items-center">
      <p className="text-sm font-proximaNovaBold">
        {tier === "bronze" ? "BRONZE" : tier === "silver" ? "SILVER" : "GOLD"}
      </p>
      <p
        className={`rounded-3xl px-2 py-1 text-dark w-20 text-center font-proximaNovaBold ${
          tier === "bronze" ? "bg-bronze" : tier === "silver" ? "bg-light-gray" : "bg-gold"
        }`}
      >
        ${rewardAmount}
      </p>
      {chain.name === Chain.Eth && (
        <p className="text-xs">{tier === "bronze" ? "*All users" : tier === "silver" ? "*1 Frog" : "*5 Frogs"}</p>
      )}
      {chain.name === Chain.Base && (
        <p className="text-xs">
          {tier === "bronze" ? "*All users" : tier === "silver" ? "*5 Tadpoles" : "*5 Tads & 1 Frog"}
        </p>
      )}
    </div>
  );
}
