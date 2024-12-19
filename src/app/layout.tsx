import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import { headers } from "next/headers";
import Web3ModalProvider from "@/context";
import { NextUIProvider } from "@nextui-org/react";
import ResponsiveToaster from "@/components/ResponsiveToaster";
import AppWalletProvider from "@/components/AppWalletProvider";
import { ChainProvider } from "@/components/ChainProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import { PHProvider } from "@/context/posthog";
import { Analytics } from "@vercel/analytics/react";
import { Chain } from "@/models/chain";
import { Cookie } from "@/models/cookie";
import { getChainConfig } from "@/lib/chains";
import { cookies } from "next/headers";

const PostHogPageView = dynamic(() => import("../components/PotHogPageView"), { ssr: false });

export const metadata: Metadata = {
  title: "Meme Pools",
  description: "Create an instantly tradeable coin on memepools.com",
  icons: {
    icon: [{ url: "/memepools.png", type: "image/png", sizes: "32x32" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const modalCookies = headers().get("cookie");
  const cookieStore = cookies();
  const chainFromCookie = cookieStore.get(Cookie.Chain)?.value as Chain || Chain.Base;
  const initialChain = getChainConfig(chainFromCookie);

  return (
    <html lang="en">
      <body className="font-proximaNova overflow-y-scroll bg-dark text-white dark">
        <NextUIProvider>
          <Web3ModalProvider cookies={modalCookies}>
            <AppWalletProvider>
              <ChainProvider initialChain={initialChain}>
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
