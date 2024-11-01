"use client";
import useCreatorRewards from "@/hooks/useCreatorRewards";
import { Address } from "viem";

type LaunchRewardsTextProps = {
  address: Address;
};

export default function LaunchRewardsText({ address }: LaunchRewardsTextProps) {
  const { rewardTier, rewardAmount } = useCreatorRewards(address);

  return (
    <div>
      <p className="text-2xl">Launch Rewards</p>
      <p className="mb-6">
        You earn <span className="text-green">${rewardAmount}</span> per coin launch with{" "}
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
