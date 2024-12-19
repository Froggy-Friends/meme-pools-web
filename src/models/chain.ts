import { Address } from "viem";

export enum Chain {
  Solana = "solana",
  Base = "base",
  Eth = "eth",
}

export type ChainConfig = {
  name: Chain;
  id: number;
  explorerUrl: string;
  logo: string;
};

export type ChainConfigs = {
  eth: ChainConfig;
  base: ChainConfig;
  solana: ChainConfig;
};
