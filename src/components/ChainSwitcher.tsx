"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Chain } from "@/models/chain";
import Image from "next/image";
import { baseLogo, solanaLogo } from "@/config/chains";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";

export default function ChainSwitcher() {
  const router = useRouter();
  const { chain, setChain } = useChain();

  return (
    <Dropdown
      className="min-w-0 w-fit py-2 px-3 bg-dark-gray"
      placement="bottom-end"
    >
      <DropdownTrigger>
        <div className="bg-dark-gray hover:bg-white/[5%] rounded-lg p-2 cursor-pointer">
          <Image
            className="transition-transform"
            src={chain === Chain.Solana ? solanaLogo : baseLogo}
            alt="chain-logo"
            height={45}
            width={45}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem
          key="Solana"
          onPress={() => {
            router.push("/solana");
            setChain(Chain.Solana);
          }}
        >
          <div className="flex items-center gap-x-3">
            <Image src={solanaLogo} alt="solana-logo" height={40} width={40} />
            <p className="text-[17px]">Solana</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="Base"
          onPress={() => {
            router.push("/base");
            setChain(Chain.Base);
          }}
        >
          <div className="flex items-center gap-x-3">
            <Image src={baseLogo} alt="solana-logo" height={40} width={40} />
            <p className="text-[17px]">Base</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
