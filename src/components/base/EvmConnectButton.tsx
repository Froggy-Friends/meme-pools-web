"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react";

export default function EvmConnectButton() {
  const { open } = useWeb3Modal();

  return (
    <>
      <button
        className="py-2 px-4 rounded-md bg-green text-white/90 font-bold hover:bg-green-500/85"
        onClick={() => open()}
      >
        Connect
      </button>
    </>
  );
}
