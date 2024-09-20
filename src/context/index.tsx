"use client";

import { config } from "@/config/wagmi";
import { ReactNode, useState } from "react";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";
import { walletConnectProjectId } from "@/config/env";

createWeb3Modal({
  wagmiConfig: config,
  projectId: walletConnectProjectId,
  enableAnalytics: true,
  enableOnramp: true,
});

export default function Web3ModalProvider({ children, initialState }: { children: ReactNode; initialState?: State }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
