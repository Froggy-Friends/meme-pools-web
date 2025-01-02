"use client";

import { solanaWeb3JsAdapter, wagmiAdapter } from "@/config/reown";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet, sepolia, baseSepolia, base, solana, solanaTestnet, solanaDevnet, apeChain } from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { walletConnectProjectId } from "@/config/env";
import { ethChain } from "@/config/env";

const queryClient = new QueryClient();

if (!walletConnectProjectId) {
  throw new Error("Project ID is not defined");
}

const metadata = {
  name: "Meme Pools",
  description: "Create an instantly tradeable coin on Meme Pools.",
  url: "https://memepools.com",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  projectId: walletConnectProjectId,
  networks: [mainnet, sepolia, baseSepolia, base, solana, solanaTestnet, solanaDevnet, apeChain],
  defaultNetwork: ethChain,
  metadata: metadata,
  features: {
    analytics: true,
    socials: false, // Optional - defaults to your Cloud configuration
  },
});

function Web3ModalProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default Web3ModalProvider;
