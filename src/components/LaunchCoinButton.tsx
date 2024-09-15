"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";

export default function LaunchCoinButton() {
  const router = useRouter();
  const { chain } = useChain();

  return (
    <button
      onClick={() => router.push(`/${chain}/launch`)}
      className="flex items-center gap-2.5 rounded-lg bg-green px-4 py-2 font-proximaSoftBold text-black hover:bg-opacity-80 transition-all"
    >
      <Image src="/rocket-black.svg" alt="rocket" width={16} height={16} />
      Launch Token
    </button>
  );
}
