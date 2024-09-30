import type { Metadata } from "next";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/config/wagmi";
import Web3ModalProvider from "@/context";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import AppWalletProvider from "@/components/AppWalletProvider";
import { ChainProvider } from "@/components/ChainProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Frog.fun",
  description: "Launch a tradeable coin instantly in one click on http://frog.fun/",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));

  return (
    <html lang="en">
      <body className="font-proximaSoft overflow-y-scroll bg-dark text-white dark">
        <NextUIProvider>
          <Web3ModalProvider initialState={initialState}>
            <AppWalletProvider>
              <ChainProvider>
                <Toaster position="bottom-center" />
                <ErrorBoundary>{children}</ErrorBoundary>
              </ChainProvider>
            </AppWalletProvider>
          </Web3ModalProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
