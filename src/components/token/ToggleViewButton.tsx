"use client";

import { useChain } from "@/context/chain";
import { cn } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ToggleViewButtonProps = {
  name: string;
  tokenAddress: string;
  view: string;
};

export default function ToggleViewButton({ name, tokenAddress, view }: ToggleViewButtonProps) {
  const router = useRouter();
  const { chain } = useChain();
  const isActive = view.toLowerCase() === name.toLowerCase();
  const href = `/${chain.name}/token/${tokenAddress}?view=${name.toLowerCase()}`;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href, { scroll: false });
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn(
        "bg-dark rounded-xl py-[0.375rem] px-3 text-white hover:bg-gray transition",
        isActive && "bg-dark-primary hover:bg-dark-primary cursor-default"
      )}
    >
      {name}
    </Link>
  );
}
