import { formatNumber } from "@/lib/format";
import useEthPrice from "./useEthPrice";
import { Address } from "viem";
import { Chain } from "@/models/chain";
import { getMarketcapGoal } from "@/lib/chains";
import useApePrice from "./useApePrice";
import { apeChainMarketcapGoal } from "@/config/token";

export default function useMarketcapGoal(
  contractAddress: Address,
  chain: Chain
) {
  const ethMarketcapGoal = getMarketcapGoal(chain, contractAddress);
  const ethPrice = useEthPrice();
  const apePrice = useApePrice();

  let marketcapGoal;
  if (chain === Chain.ApeChain) {
    marketcapGoal = Math.round(apeChainMarketcapGoal * apePrice);
  } else {
    marketcapGoal = Math.round(ethPrice * ethMarketcapGoal);
  }

  return formatNumber(marketcapGoal);
}
