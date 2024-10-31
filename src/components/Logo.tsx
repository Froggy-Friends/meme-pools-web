"use client";

import Image from "next/image";
import memepoolsLogo from "../../public/memepools.svg";
import Link from "next/link";
import { useChain } from "@/context/chain";

type LogoProps = {
  height?: number;
  width?: number;
};

export default function Logo({ height = 70, width = 70 }: LogoProps) {
  const { chain } = useChain();

  return (
    <Link href={`/${chain.name}`} className="hover:scale-[1.02] transition">
      <Image src={memepoolsLogo} alt="Memepools" height={height} width={width} />
    </Link>
  );
}
