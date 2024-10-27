import { Address } from "viem";
import { base, baseSepolia, mainnet, sepolia } from "viem/chains";

export const env = process.env.NEXT_PUBLIC_ENV;
export const isProd = env === "prod";

// api
export const memepoolsApi = isProd
  ? "https://api.memepools.com"
  : "https://dev.api.memepools.com";

// evm
export const contractAddress: Address = isProd
  ? "0x0"
  : "0x8317301D9Bb8B681D3Ac07ca2Ea71C0621799098";
export const ethChainId = isProd ? 1 : 11155111;
export const baseChainId = isProd ? 8453 : 84532;
export const ethChain = isProd ? mainnet : sepolia;
export const baseChain = isProd ? base : baseSepolia;

// solana
export const solanaChainId = isProd ? 0 : 0;

// wallet connect
export const walletConnectProjectId = "28fb63c6591b078e4eca73e608508aec";

// rpc
export const rpcUrl = isProd
  ? "https://eth-mainnet.g.alchemy.com/v2/358SQJo2XqDKYfLOCmgg6blgDdMZgVAm"
  : "https://eth-sepolia.g.alchemy.com/v2/358SQJo2XqDKYfLOCmgg6blgDdMZgVAm";

// explorer
export const etherscanUrl = isProd
  ? "https://etherscan.io"
  : "https://sepolia.etherscan.io";
export const baseExplorerUrl = isProd
  ? "https://basescan.org"
  : "https://sepolia.basescan.org";
export const solanaExplorerUrl = "https://solscan.io";
