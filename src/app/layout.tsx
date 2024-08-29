import type { Metadata } from "next";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import Moralis from "moralis";
import AppWalletProvider from "@/components/AppWalletProvider";
import { ChainProvider } from "@/components/ChainProvider";
import { PusherProvider } from "@/providers/PusherProvider";

export const metadata: Metadata = {
  title: "Frog.fun",
  description:
    "Launch a tradeable coin instantly in one click on http://frog.fun/",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  if (!Moralis.Core.isStarted) {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    });
  }

  return (
    <html lang="en">
      <body className="font-proximaSoft overflow-y-scroll bg-dark text-white">
        <NextUIProvider>
          <Web3ModalProvider initialState={initialState}>
            <AppWalletProvider>
              <ChainProvider>
                <PusherProvider>
                  <Toaster position="bottom-center" />
                  {children}
                </PusherProvider>
              </ChainProvider>
            </AppWalletProvider>
          </Web3ModalProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
