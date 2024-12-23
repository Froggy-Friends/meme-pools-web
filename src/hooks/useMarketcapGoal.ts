import { formatNumber } from "@/lib/format";
import useEthPrice from "./useEthPrice";
import { Address } from "viem";
import { Chain } from "@/models/chain";
import { getMarketcapGoal } from "@/lib/chains";

export default function useMarketcapGoal(contractAddress: Address, chain: Chain) {
  const ethMarketcapGoal = getMarketcapGoal(chain, contractAddress);
  const ethPrice = useEthPrice();

  const marketcapGoal = Math.round(ethPrice * ethMarketcapGoal);
  return formatNumber(marketcapGoal);
}
