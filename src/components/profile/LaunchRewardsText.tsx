"use client";
import useCreatorRewards from "@/hooks/useCreatorRewards";
import { Address } from "viem";

type LaunchRewardsTextProps = {
  addresses: Address[];
};

export default function LaunchRewardsText({ addresses }: LaunchRewardsTextProps) {
  const { rewardTier, rewardAmount } = useCreatorRewards(addresses);

  return (
    <div>
      <p className="text-2xl">Launch Rewards</p>
      <p className="mb-6">
        You earn <span className="text-green">${rewardAmount}</span> per coin launch with{" "}
        <span
          className={`${
            rewardTier === "bronze" ? "text-bronze" : rewardTier === "silver" ? "text-light-gray" : "text-gold"
          }`}
        >
          {rewardTier}
        </span>{" "}
        rewards.
      </p>
    </div>
  );
}
