export enum Chain {
  Solana = "solana",
  Base = "base",
  Eth = "eth",
}

export type ChainConfig = {
  name: Chain;
  id: number;
};

export type ChainConfigs = {
  eth: ChainConfig;
  base: ChainConfig;
  solana: ChainConfig;
};
