"use client";
import useRewardTier from "@/hooks/useRewardTier";
import { useEffect } from "react";
import { Address } from "viem";

type LaunchRewardsTextProps = {
  address: Address;
};

export default function LaunchRewardsText({ address }: LaunchRewardsTextProps) {
  const rewardTier = useRewardTier(address);

  return (
    <div>
      <p className="text-2xl">Launch Rewards</p>
      <p className="mb-6">
        You earn{" "}
        <span className="text-green">
          {rewardTier === "tier one" ? "$500" : rewardTier === "tier two" ? "$1000" : "$1500"}
        </span>{" "}
        per coin launch with{" "}
        <span
          className={`${
            rewardTier === "tier one" ? "text-bronze" : rewardTier === "tier two" ? "text-light-gray" : "text-gold"
          }`}
        >
          {rewardTier}
        </span>{" "}
        rewards.
      </p>
    </div>
  );
}
