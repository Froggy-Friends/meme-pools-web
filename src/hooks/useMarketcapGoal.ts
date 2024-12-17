import { formatNumber } from "@/lib/format";
import useEthPrice from "./useEthPrice";
import { Address } from "viem";
import { contractAddressV1 } from "@/config/env";
import { ethMarketcapGoalV1, ethMarketcapGoalV2 } from "@/config/token";

export default function useMarketcapGoal(contractAddress: Address) {
  const ethMarketcapGoal =
    contractAddress === contractAddressV1
      ? ethMarketcapGoalV1
      : ethMarketcapGoalV2;
  const ethPrice = useEthPrice();

  const marketcapGoal = Math.round(ethPrice * ethMarketcapGoal);
  return formatNumber(marketcapGoal);
}
