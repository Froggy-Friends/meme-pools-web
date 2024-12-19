import { chainConfigs } from "@/config/chains";
import {
  baseClaimContractAddress,
  baseContractAddress,
  claimContractAddress,
  contractAddress,
  froggyFriendsAddress,
  froggyFriendsBaseAddress,
} from "@/config/env";
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

export const getExplorerUrl = (chain: Chain, txHash: string) => {
  return `https://${chainConfigs[chain].explorerUrl}/tx/${txHash}`;
};

export const getFrogAddress = (chain: Chain) => {
  return chain === Chain.Eth ? froggyFriendsAddress : froggyFriendsBaseAddress;
};

export const getContractAddress = (chain: Chain) => {
  return chain === Chain.Eth ? contractAddress : baseContractAddress;
};

export const getClaimContractAddress = (chain: Chain) => {
  return chain === Chain.Eth ? claimContractAddress : baseClaimContractAddress;
};

export const getChainLogo = (chain: Chain) => {
  return chainConfigs[chain].logo;
};
