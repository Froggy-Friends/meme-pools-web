import { Address } from "viem";
import {
  tierTwoEthReward,
  tierThreeEthReward,
  tierTwoBaseReward,
  tierThreeBaseReward,
} from "@/config/token";
import useEthPrice from "./useEthPrice";
import useFrogBalance from "./useFrogBalance";
import { useChain } from "@/context/chain";
import useTadpoleBalance from "./useTadpoleBalance";
import { Chain } from "@/models/chain";
import { getTierOneReward } from "@/lib/chains";

export default function useCreatorRewards(walletAddresses: Address[]) {
  const { chain } = useChain();
  const frogBalance = useFrogBalance(walletAddresses, chain.name);
  const tadpoleBalance = useTadpoleBalance(walletAddresses);
  const ethPrice = useEthPrice();
  let rewardTier = "bronze";
  let ethMultiplier = getTierOneReward(chain.name);

  if (chain.name === Chain.Eth && frogBalance && Number(frogBalance) >= 5) {
    rewardTier = "gold";
    ethMultiplier = tierThreeEthReward;
  } else if (
    chain.name === Chain.Eth &&
    frogBalance &&
    Number(frogBalance) >= 1
  ) {
    rewardTier = "silver";
    ethMultiplier = tierTwoEthReward;
  } else if (
    chain.name === Chain.Base &&
    tadpoleBalance &&
    Number(tadpoleBalance) >= 5 &&
    frogBalance &&
    Number(frogBalance) >= 1
  ) {
    rewardTier = "gold";
    ethMultiplier = tierThreeBaseReward;
  } else if (
    chain.name === Chain.Base &&
    tadpoleBalance &&
    Number(tadpoleBalance) >= 5
  ) {
    rewardTier = "silver";
    ethMultiplier = tierTwoBaseReward;
  }

  const rewardAmount = Math.round(ethPrice * ethMultiplier);

  return {
    rewardTier,
    rewardAmount: rewardAmount ?? 0,
  };
}
