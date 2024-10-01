import { Address } from "viem";

export const env = process.env.NEXT_PUBLIC_ENV;
export const isProd = env === "prod";

// api
export const frogFunApi = isProd ? "https://api.frog.fun" : "https://dev.api.frog.fun";

// evm
export const contractAddress: Address = isProd ? "0x0" : "0xb5DdD2Ca2E43eE59882075abeefd79a01b5cE914";
export const ethChainId = isProd ? 1 : 11155111;
export const baseChainId = isProd ? 8453 : 84532;

// solana
export const solanaChainId = isProd ? 0 : 0;

// wallet connect
export const walletConnectProjectId = "28fb63c6591b078e4eca73e608508aec";

// rpc
export const rpcUrl = isProd
  ? 'https://eth-mainnet.g.alchemy.com/v2/358SQJo2XqDKYfLOCmgg6blgDdMZgVAm'
  : 'https://eth-sepolia.g.alchemy.com/v2/358SQJo2XqDKYfLOCmgg6blgDdMZgVAm';
