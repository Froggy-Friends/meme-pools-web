import { chainConfigs } from "@/config/chains";
import { Chain, ChainConfig } from "@/models/chain";

export function getChainConfig(path: string): ChainConfig {
  if (path === `/${Chain.Eth}`) {
    return chainConfigs.eth;
  } else if (path === `/${Chain.Base}`) {
    return chainConfigs.base;
  } else if (path === `/${Chain.Solana}`) {
    return chainConfigs.solana;
  } else {
    return chainConfigs.eth;
  }
}
