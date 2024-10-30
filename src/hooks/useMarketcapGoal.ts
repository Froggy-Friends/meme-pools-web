import { formatNumber } from "@/lib/format";
import useEthPrice from "./useEthPrice";

export default function useMarketcapGoal() {
  const ethMarketcapGoal = 15.9;
  const ethPrice = useEthPrice();

  const marketcapGoal = Math.round(ethPrice * ethMarketcapGoal);
  return formatNumber(marketcapGoal);
}
