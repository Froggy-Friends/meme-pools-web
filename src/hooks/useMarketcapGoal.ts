import { formatNumber } from "@/lib/format";
import useEthPrice from "./useEthPrice";
import { Address } from "viem";
import { contractAddressV1 } from "@/config/env";


export default function useMarketcapGoal(contractAddress: Address) {
  const ethMarketcapGoal = contractAddress === contractAddressV1 ? 15.9 : 13.1;
  const ethPrice = useEthPrice();

  const marketcapGoal = Math.round(ethPrice * ethMarketcapGoal);
  return formatNumber(marketcapGoal);
}
