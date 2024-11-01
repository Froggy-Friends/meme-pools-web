"use client";

import Image from "next/image";
import memepoolsLogo from "../../public/memepools.svg";
import Link from "next/link";
import { useChain } from "@/context/chain";
import { cn } from "@nextui-org/react";

type LogoProps = {
  height?: number;
  width?: number;
  className?: string;
};

export default function Logo({ height = 70, width = 70, className }: LogoProps) {
  const { chain } = useChain();

  return (
    <Link href={`/${chain.name}`} className={cn("hover:scale-[1.02] transition", className)}>
      <Image src={memepoolsLogo} alt="Meme Pools" height={height} width={width} />
    </Link>
  );
}
