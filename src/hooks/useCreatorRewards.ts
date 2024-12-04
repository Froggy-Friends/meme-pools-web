import { Address } from "viem";
import {
  tierOneEthReward,
  tierTwoEthReward,
  tierThreeEthReward,
} from "@/lib/constants";
import useEthPrice from "./useEthPrice";
import useFrogBalance from "./useFrogBalance";

export default function useCreatorRewards(walletAddresses: Address[]) {
  const frogBalance = useFrogBalance(walletAddresses);
  const ethPrice = useEthPrice();
  let rewardTier = "bronze";
  let ethMultiplier = tierOneEthReward;

  if (frogBalance && Number(frogBalance) >= 5) {
    rewardTier = "gold";
    ethMultiplier = tierThreeEthReward;
  } else if (frogBalance && Number(frogBalance) >= 1) {
    rewardTier = "silver";
    ethMultiplier = tierTwoEthReward;
  }

  const rewardAmount = Math.round(ethPrice * ethMultiplier);

  return {
    rewardTier,
    rewardAmount: rewardAmount ?? 0,
  };
}
