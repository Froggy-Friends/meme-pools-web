"use client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Chain, ChainConfig } from "@/models/chain";
import Image from "next/image";
import { baseLogo, solanaLogo, ethLogo, chainConfigs } from "@/config/chains";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";

type ChainSwitcherProps = {
  height?: number;
  width?: number;
};

export default function ChainSwitcher({ height = 25, width = 25 }: ChainSwitcherProps) {
  const router = useRouter();
  const { chain, setChain } = useChain();

  const getChainLogo = (chain: Chain) => {
    if (chain === Chain.Base) return baseLogo;
    else if (chain === Chain.Eth) return ethLogo;
    else if (chain === Chain.Solana) return solanaLogo;
    else return ethLogo;
  };

  // see src/configs/chains for configs
  const handleChainSwitch = (chainConfig: ChainConfig) => {
    setChain(chainConfig);
    router.push(`/${chainConfig.name}`);
  };

  return (
    <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray" placement="bottom-end">
      <DropdownTrigger>
        <div className="hover:bg-gray transition rounded-lg p-1 laptop:p-2 cursor-pointer">
          <Image
            className="transition-transform"
            src={getChainLogo(chain.name)}
            alt="chain-logo"
            height={height}
            width={width}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu disabledKeys={["Solana", "Base"]}>
        <DropdownItem key="Eth" className="dark" onPress={() => handleChainSwitch(chainConfigs.eth)}>
          <div className="flex items-center gap-x-3">
            <Image src={ethLogo} alt="eth-logo" height={height} width={width} />
            <p className="text-[17px]">ETH</p>
          </div>
        </DropdownItem>
        <DropdownItem key="Solana" className="dark" onPress={() => handleChainSwitch(chainConfigs.solana)}>
          <div className="flex items-center gap-x-3">
            <Image src={solanaLogo} alt="solana-logo" height={height} width={width} />
            <p className="text-[17px]">Solana</p>
          </div>
        </DropdownItem>
        <DropdownItem key="Base" className="dark" onPress={() => handleChainSwitch(chainConfigs.base)}>
          <div className="flex items-center gap-x-3">
            <Image src={baseLogo} alt="base-logo" height={height} width={width} />
            <p className="text-[17px]">Base</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
