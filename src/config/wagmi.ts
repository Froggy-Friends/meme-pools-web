import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage, http } from "wagmi";
import { mainnet, sepolia, baseSepolia, base } from "wagmi/chains";
import { isProd, walletConnectProjectId } from "./env";

export const metadata = {
  name: "Meme Pools",
  description: "Create an instantly tradeable coin on Meme Pools.",
  url: "https://memepools.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const wagmiChains = {
  eth: isProd ? mainnet : sepolia,
  base: isProd ? base : baseSepolia,
};
const chains = [wagmiChains.eth, wagmiChains.base] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId: walletConnectProjectId,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});
