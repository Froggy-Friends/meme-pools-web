import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cookieToInitialState } from "wagmi";
import { headers } from "next/headers";
import { config } from "@/config";
import Web3ModalProvider from "@/context";
import { NextUIProvider } from "@nextui-org/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Frog.fun",
  description:
    "Launch a tradeable coin instantly in one click on http://frog.fun/",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-y-scroll`}>
        <NextUIProvider>
          <Web3ModalProvider initialState={initialState}>
            <Header />
            <Toaster position="bottom-center" />
            {children}
            <Footer />
          </Web3ModalProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
