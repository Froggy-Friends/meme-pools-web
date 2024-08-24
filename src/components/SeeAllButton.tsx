"use client";

import { FaExternalLinkAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";

export default function SeeAllButton() {
  const router = useRouter();
  const { chain } = useChain();

  return (
    <button
      className="flex items-center gap-x-2 mx-auto text-lg text-light-green -mt-1 hover:text-light-green/80"
      onClick={() => router.push(`/${chain}/tokens/votes?page=1`)}
    >
      <p>See All</p>
      <FaExternalLinkAlt size={18} />
    </button>
  );
}
