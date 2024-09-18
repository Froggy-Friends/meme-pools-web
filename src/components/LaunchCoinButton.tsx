"use client";

import Image from "next/image";
import Link from "next/link";

export default function LaunchCoinButton() {
  return (
    <Link
      href="/launch"
      className="flex items-center gap-2.5 h-8 w-38 text-sm rounded-lg bg-green px-4 py-2 font-proximaSoftBold text-black hover:bg-opacity-80 transition-all"
    >
      <Image src="/rocket-black.svg" alt="rocket" width={16} height={16} />
      Launch Token
    </Link>
  );
}
