"use client";

import { config, projectId } from "@/config";
import { ReactNode } from "react";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import { getQueryClient } from "@/lib/queryClient";
import { State, WagmiProvider } from "wagmi";

if (!projectId) throw new Error("Project ID is not defined");

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

export default function Web3ModalProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const queryClient = getQueryClient();

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
