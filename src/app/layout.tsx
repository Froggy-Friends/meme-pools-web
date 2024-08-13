import { config } from "@/config";
import Web3ModalProvider from "@/context";
import { NextUIProvider } from "@nextui-org/react";
import Moralis from "moralis";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { Toaster } from "react-hot-toast";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} overflow-y-scroll`}>
        <NextUIProvider>
          <Web3ModalProvider initialState={initialState}>
            <Toaster position="bottom-center" />
            {children}
          </Web3ModalProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
