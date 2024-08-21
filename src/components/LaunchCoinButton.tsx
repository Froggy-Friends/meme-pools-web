"use client";

import { Chain } from "@/models/chain";
import { useRouter } from "next/navigation";

type LaunchCoinButtonProps = {
  chain: Chain;
}

export default function LaunchCoinButton({chain}: LaunchCoinButtonProps) {
  const router = useRouter();

  return (
    <button
      className="w-[14rem] mx-auto text-xl border-[1px] border-black rounded-lg py-2 px-3"
      onClick={() => router.push(`${chain}/launch`)}
    >
      Launch a new coin
    </button>
  );
}
