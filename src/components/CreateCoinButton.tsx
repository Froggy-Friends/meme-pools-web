"use client";

import Image from "next/image";
import Link from "next/link";

export default function CreateCoinButton() {
  return (
    <Link
      href="/create"
      className="flex items-center justify-center gap-2.5 h-8 w-38 text-sm rounded-lg bg-primary px-2 desktop:px-4 py-2 font-proximaSoftBold text-black hover:bg-light-primary active:scale-[0.97] transition-all"
    >
      <Image src="/rocket-black.svg" alt="rocket" width={16} height={16} />
      <p className="tablet:hidden desktop:block">Create Token</p>
    </Link>
  );
}
