"use client";

import { useChain } from "@/context/chain";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const { chain } = useChain();

  return (
    <button
      className="bg-dark-gray border-[0.25px] border-white/[5%] rounded-3xl w-24 px-3 py-2 mb-6 text-lg hover:bg-white/[7%]"
      onClick={() => router.push(`/${chain}`)}
    >
      Back
    </button>
  );
}
