import { chainConfigs } from "@/config/chains";
import {
  tierOneEthReward,
  tierOneBaseReward,
  tierTwoBaseReward,
  tierTwoEthReward,
  tierThreeBaseReward,
  tierThreeEthReward,
  maxTradeableSupply,
  maxTradeableSupplyBase,
} from "@/config/token";
import {
  baseClaimContractAddress,
  baseContractAddress,
  claimContractAddress,
  contractAddress,
  froggyFriendsAddress,
  baseFroggyFriendsAddress,
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

export const getTierOneReward = (chain: Chain) => {
  return chain === Chain.Eth ? tierOneEthReward : tierOneBaseReward;
};

export const getTierTwoReward = (chain: Chain) => {
  return chain === Chain.Eth ? tierTwoEthReward : tierTwoBaseReward;
};

export const getTierThreeReward = (chain: Chain) => {
  return chain === Chain.Eth ? tierThreeEthReward : tierThreeBaseReward;
};

export const getExplorerUrl = (chain: Chain, txHash: string) => {
  return `${chainConfigs[chain].explorerUrl}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (chain: Chain, address: string) => {
  return `${chainConfigs[chain].explorerUrl}/${chain === Chain.Solana ? "account" : "address"}/${address}`;
};

export const getFrogAddress = (chain: Chain) => {
  return chain === Chain.Eth ? froggyFriendsAddress : baseFroggyFriendsAddress;
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

export const getMaxTradeableSupply = (chain: Chain) => {
  return chain === Chain.Eth ? maxTradeableSupply : maxTradeableSupplyBase;
};
