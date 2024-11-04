import { useReadContract } from "wagmi";
import { Address } from "viem";
import { froggyFriendsAddress } from "@/config/eth/froggyFriends";
import { froggyFriendsAbi } from "@/abi/froggyFriends";
import {
  tierOneEthReward,
  tierTwoEthReward,
  tierThreeEthReward,
} from "@/lib/constants";
import useEthPrice from "./useEthPrice";

export default function useCreatorRewards(walletAddress: Address) {
  const ethPrice = useEthPrice();
  let rewardTier = "bronze";
  let ethMultiplier = tierOneEthReward;

  const { data: frogBalance } = useReadContract({
    address: froggyFriendsAddress,
    abi: froggyFriendsAbi,
    functionName: "balanceOf",
    args: [walletAddress],
    query: {
      enabled: !!walletAddress,
    },
  });

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
