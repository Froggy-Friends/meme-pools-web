import { Address } from "viem";
import { base, baseSepolia, mainnet, sepolia } from "viem/chains";

export const env = process.env.NEXT_PUBLIC_ENV;
export const isProd = env === "prod";

// domain
export const memepoolsDomain = isProd
  ? "https://memepools.com"
  : "https://beta.memepools.com";

// api
export const memepoolsApi = isProd
  ? "https://api.memepools.com"
  : "https://beta.api.memepools.com";

// evm
export const contractAddress: Address = isProd
  ? "0x4bA69e95F5F18902Cad88a1e35E037F1DC7E7b77"
  : "0xA6d2E7e8984D57a95F0DB6Ae06087cA43E20B3E8";
export const froggyFriendsAddress: Address = isProd
  ? "0x7ad05c1b87e93BE306A9Eadf80eA60d7648F1B6F"
  : "0xc8939011efd81fB0ca8382ed15EAb160c3a69313";
export const claimContractAddress: Address = isProd
  ? "0x5D606A1eB8Cd7c50092866725B9982355b4a5F4C"
  : "0x5D606A1eB8Cd7c50092866725B9982355b4a5F4C";
export const ethChainId = isProd ? 1 : 11155111;
export const baseChainId = isProd ? 8453 : 84532;
export const ethChain = isProd ? mainnet : sepolia;
export const baseChain = isProd ? base : baseSepolia;
export const moralisEthChain = isProd ? "eth" : "sepolia";

// solana
export const solanaChainId = isProd ? 0 : 0;

// wallet connect
export const walletConnectProjectId = "28fb63c6591b078e4eca73e608508aec";

// explorer
export const etherscanUrl = isProd
  ? "https://etherscan.io"
  : "https://sepolia.etherscan.io";
export const baseExplorerUrl = isProd
  ? "https://basescan.org"
  : "https://sepolia.basescan.org";
export const solanaExplorerUrl = "https://solscan.io";
