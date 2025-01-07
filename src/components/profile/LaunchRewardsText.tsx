"use client";
import { apeChainReward } from "@/config/token";
import { useChain } from "@/context/chain";
import useApePrice from "@/hooks/useApePrice";
import useCreatorRewards from "@/hooks/useCreatorRewards";
import { Chain } from "@/models/chain";
import { Address } from "viem";

type LaunchRewardsTextProps = {
  addresses: Address[];
};

export default function LaunchRewardsText({ addresses }: LaunchRewardsTextProps) {
  const { rewardTier, rewardAmount } = useCreatorRewards(addresses);
  const apePrice = useApePrice();
  const apeReward = Math.round(apeChainReward * apePrice);
  const { chain } = useChain();

  return (
    <div>
      <p className="text-2xl">Launch Rewards</p>
      {chain.name === Chain.ApeChain ? (
        <p className="mb-6">
          You earn <span className="text-green">${apeReward}</span> per coin launch
        </p>
      ) : (
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
      )}
    </div>
  );
}
