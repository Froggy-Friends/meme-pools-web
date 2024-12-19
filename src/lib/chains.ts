import { chainConfigs } from "@/config/chains";
import {
  tierOneBaseReward,
  tierTwoBaseReward,
  tierTwoEthReward,
  tierThreeBaseReward,
  tierThreeEthReward,
} from "@/config/token";
import { tierOneEthReward } from "@/config/token";
import { Chain, ChainConfig } from "@/models/chain";

export function getChainConfig(path: string): ChainConfig {
  if (path === `/${Chain.Eth}` || path === Chain.Eth) {
    return chainConfigs.eth;
  } else if (path === `/${Chain.Base}` || path === Chain.Base) {
    return chainConfigs.base;
  } else if (path === `/${Chain.Solana}` || path === Chain.Solana) {
    return chainConfigs.solana;
  } else {
    return chainConfigs.eth;
  }
}

export const getTierOneReward = (chain: Chain) => {
  return chain === Chain.Eth ? tierOneEthReward : tierOneBaseReward;
};

export const getTierTwoReward = (chain: Chain) => {
  return chain === Chain.Eth ? tierTwoEthReward : tierTwoBaseReward;
};

export const getTierThreeReward = (chain: Chain) => {
  return chain === Chain.Eth ? tierThreeEthReward : tierThreeBaseReward;
};
