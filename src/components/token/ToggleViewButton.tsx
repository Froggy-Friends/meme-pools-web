"use client";

import { useChain } from "@/context/chain";
import { cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";

type ToggleViewButtonProps = {
  name: string;
  tokenAddress: string;
  view: string;
};

export default function ToggleViewButton({
  name,
  tokenAddress,
  view,
}: ToggleViewButtonProps) {
  const router = useRouter();
  const { chain } = useChain();
  return (
    <button
      onClick={() =>
        router.push(`/${chain}/token/${tokenAddress}?view=${name.toLowerCase()}`)
      }
      className={cn(
        "bg-dark rounded-3xl py-[0.375rem] px-3 text-white hover:bg-gray",
        view === name.toLowerCase() && "bg-gray"
      )}
    >
      {name}
    </button>
  );
}
