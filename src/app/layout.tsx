import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/config/wagmi";
import Web3ModalProvider from "@/context";
import { NextUIProvider } from "@nextui-org/react";
import ResponsiveToaster from "@/components/ResponsiveToaster";
import AppWalletProvider from "@/components/AppWalletProvider";
import { ChainProvider } from "@/components/ChainProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PHProvider } from "@/context/posthog";
import { Analytics } from "@vercel/analytics/react";

const PostHogPageView = dynamic(() => import("../components/PotHogPageView"), { ssr: false });

export const metadata: Metadata = {
  title: "Memepools",
  description: "Launch a tradeable coin instantly in one click on memepools.com",
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
                <PHProvider>
                  <PostHogPageView />
                  <ResponsiveToaster />
                  <ErrorBoundary>
                    {children}
                    <Analytics />
                  </ErrorBoundary>
                </PHProvider>
              </ChainProvider>
            </AppWalletProvider>
          </Web3ModalProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
