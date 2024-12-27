import { isProd, walletConnectProjectId } from "./env";
import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { SolanaAdapter } from "@reown/appkit-adapter-solana";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  mainnet,
  sepolia,
  baseSepolia,
  base,
  solana,
  solanaDevnet,
  solanaTestnet,
} from "@reown/appkit/networks";
import { http } from "viem";

if (!walletConnectProjectId) {
  throw new Error("Project ID is not defined");
}

export const wagmiChains = {
  eth: isProd ? mainnet : sepolia,
  base: isProd ? base : baseSepolia,
};

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId: walletConnectProjectId,
  networks: [
    mainnet,
    sepolia,
    base,
    baseSepolia,
    solana,
    solanaTestnet,
    solanaDevnet,
  ],
  transports: {
    [mainnet.id]: http(process.env.ETH_MAINNET_RPC_URL),
    [sepolia.id]: http(process.env.SEPOLIA_RPC_URL),
    [base.id]: http(process.env.BASE_RPC_URL),
  },
});

export const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});
