"use client";

import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function EvmConnectButton() {
  const { open } = useWeb3Modal();

  return (
    <>
      <button
        className="flex items-center h-8 w-38 py-2 px-4 rounded-md bg-green text-dark text-sm font-proximaSoftBold hover:bg-light-green active:scale-[0.97] transition"
        onClick={() => open()}
      >
        Connect
      </button>
    </>
  );
}
