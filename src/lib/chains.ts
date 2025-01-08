import {
  solanaLogo,
  chainConfigs,
  ethLogo,
  apeCoinLogo,
} from "@/config/chains";
import {
  tierOneEthReward,
  tierOneBaseReward,
  tierTwoBaseReward,
  tierTwoEthReward,
  tierThreeBaseReward,
  tierThreeEthReward,
  maxTradeableSupply,
  maxTradeableSupplyBase,
  baseMarketcapGoalV1,
  ethMarketcapGoalV1,
  ethMarketcapGoalV2,
} from "@/config/token";
import {
  baseClaimContractAddress,
  baseContractAddress,
  claimContractAddress,
  contractAddress,
  froggyFriendsAddress,
  baseFroggyFriendsAddress,
  apeChainContractAddress,
} from "@/config/env";
import { Chain, ChainConfig } from "@/models/chain";
import { Address } from "viem";
import { memepoolsAbi } from "@/abi/memepools";
import { memepoolsApechainAbi } from "@/abi/memepoolsApechain";
import getApePrice from "./getApePrice";
import getEthPrice from "./getEthPrice";
import { apeChain, base, mainnet } from "viem/chains";

export function getChainConfig(path: string): ChainConfig {
  if (path === `/${Chain.Eth}` || path === Chain.Eth) {
    return chainConfigs.eth;
  } else if (path === `/${Chain.Base}` || path === Chain.Base) {
    return chainConfigs.base;
  } else if (path === `/${Chain.Solana}` || path === Chain.Solana) {
    return chainConfigs.solana;
  } else if (path === `/${Chain.ApeChain}` || path === Chain.ApeChain) {
    return chainConfigs.apechain;
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
  return `${chainConfigs[chain].explorerUrl}/${
    chain === Chain.Solana ? "account" : "address"
  }/${address}`;
};

export const getFrogAddress = (chain: Chain) => {
  return chain === Chain.Eth ? froggyFriendsAddress : baseFroggyFriendsAddress;
};

export const getContractAddress = (chain: Chain) => {
  return chain === Chain.Eth
    ? contractAddress
    : chain === Chain.Base
    ? baseContractAddress
    : apeChainContractAddress;
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

export const getMarketcapGoal = (chain: Chain, contractAdd: Address) => {
  return chain === Chain.Base
    ? baseMarketcapGoalV1
    : chain === Chain.Eth && contractAddress === contractAdd
    ? ethMarketcapGoalV2
    : ethMarketcapGoalV1;
};

export const getNativeTokenTicker = (chain: Chain) => {
  return chain === Chain.Solana
    ? "SOL"
    : chain === Chain.ApeChain
    ? "APE"
    : "ETH";
};

export const getNativeTokenLogo = (chain: Chain) => {
  return chain === Chain.Solana
    ? solanaLogo
    : chain === Chain.ApeChain
    ? apeCoinLogo
    : ethLogo;
};

export const getMemePoolsAbi = (chain: Chain) => {
  return chain === Chain.ApeChain ? memepoolsApechainAbi : memepoolsAbi;
};

export const getNativeTokenPrice = async (chain: Chain) => {
  let price = 0;
  if (chain === Chain.ApeChain) {
    price = await getApePrice();
  } else {
    price = await getEthPrice();
  }
  return price;
};

export const getViemChain = (chain: Chain) => {
  return chain === Chain.Eth
    ? mainnet
    : chain === Chain.ApeChain
    ? apeChain
    : base;
};

export const getChainRpcUrl = (chain: Chain) => {
  return chain === Chain.Eth
    ? process.env.NEXT_PUBLIC_ETH_MAINNET_RPC_URL
    : chain === Chain.Base
    ? process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
    : chain === Chain.ApeChain
    ? process.env.NEXT_PUBLIC_APE_CHAIN_RPC_URL
    : null;
};

export const getDexName = (chain: Chain) => {
  return chain === Chain.Solana
    ? "Raydium"
    : chain === Chain.ApeChain
    ? "Camelot"
    : "Uniswap";
};

export const getDexUrl = (chain: Chain, tokenAddress: Address) => {
  return chain === Chain.Solana
    ? `https://raydium.io/swap/?inputMint=So11111111111111111111111111111111111111112&outputMint=${tokenAddress}`
    : chain === Chain.ApeChain
    ? "https://app.camelot.exchange/"
    : `https://app.uniswap.org/explore/tokens/${
        chain === "eth" ? "ethereum" : chain
      }/${tokenAddress}`;
};

export const isEvmChain = (chain: Chain): boolean => {
  return (
    chain === Chain.Eth || chain === Chain.Base || chain === Chain.ApeChain
  );
};
