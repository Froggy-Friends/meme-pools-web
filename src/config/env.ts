import { Address } from "viem";
import { base, mainnet, sepolia } from "viem/chains";

export const env = process.env.NEXT_PUBLIC_ENV;
export const isProd = env === "prod";

// domain
export const memepoolsDomain = isProd
  ? "https://www.memepools.com"
  : "https://beta.memepools.com";

// api
export const memepoolsApi = isProd
  ? "https://api.memepools.com"
  : "https://beta.api.memepools.com";

// evm
export const contractAddress: Address = isProd
  ? "0x036ca20D4Cc8dE8EB783258b36F5F9499aa234A8"
  : "0xEFd94EDFCB5902dc3Ce1F379DDB006Df0326Dc34";
export const baseContractAddress: Address =
  "0x5D606A1eB8Cd7c50092866725B9982355b4a5F4C";
export const froggyFriendsAddress: Address = isProd
  ? "0x7ad05c1b87e93BE306A9Eadf80eA60d7648F1B6F"
  : "0xc8939011efd81fB0ca8382ed15EAb160c3a69313";
export const froggyFriendsBaseAddress: Address =
  "0x9DA02cBE93835E8b6c44563415C72D106B1ce00a";
export const claimContractAddress: Address = isProd
  ? "0x5D606A1eB8Cd7c50092866725B9982355b4a5F4C"
  : "0x6570Ff390976C206b05EcD5873a0aAaF7a1F3D28";
export const baseClaimContractAddress: Address =
  "0xb6224A473Edd4E401B4f86650ec58eDb124596eF";
export const contractAddressV1 = "0x4bA69e95F5F18902Cad88a1e35E037F1DC7E7b77";
export const ethChainId = isProd ? 1 : 11155111;
export const baseChainId = 8453;
export const ethChain = isProd ? mainnet : sepolia;
export const baseChain = base;
export const moralisEthChain = isProd ? "eth" : "sepolia";
export const moralisBaseChain = "base";

// solana
export const solanaChainId = isProd ? 0 : 0;

// wallet connect
export const walletConnectProjectId = "28fb63c6591b078e4eca73e608508aec";

// explorer
export const etherscanUrl = isProd
  ? "https://etherscan.io"
  : "https://sepolia.etherscan.io";
export const baseExplorerUrl = "https://basescan.org";
export const solanaExplorerUrl = "https://solscan.io";
