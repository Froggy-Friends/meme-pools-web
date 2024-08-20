"use client";

import { Avatar } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Chains } from "@/models/chains";
import Image from "next/image";
import { baseLogo, solanaLogo } from "@/config/chains";
import { useRouter } from "next/navigation";

type ChainSwitcherProps = {
  chain: Chains;
};

export default function ChainSwitcher({ chain }: ChainSwitcherProps) {
  const router = useRouter();

  return (
    <Dropdown className="min-w-0 w-fit">
      <DropdownTrigger>
        <Avatar
          as="button"
          className="transition-transform"
          src={chain === Chains.Solana ? solanaLogo : baseLogo}
          size="lg"
        />
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="Solana" onPress={() => router.push("/solana")}>
          <Image src={solanaLogo} alt="solana-logo" height={45} width={45} />
        </DropdownItem>
        <DropdownItem key="Base" onPress={() => router.push("/base")}>
          <Image src={baseLogo} alt="solana-logo" height={45} width={45} />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
