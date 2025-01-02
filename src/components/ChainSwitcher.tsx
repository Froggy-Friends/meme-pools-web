"use client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Chain, ChainConfig } from "@/models/chain";
import Image from "next/image";
import { baseLogo, solanaLogo, ethLogo, apeChainLogo, chainConfigs } from "@/config/chains";
import { useRouter } from "next/navigation";
import { useChain } from "@/context/chain";
import { useAppKit, useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import { isWalletChainCompatible } from "@/lib/wallet";
import { setUserCookies } from "@/actions/profile/actions";
import { usePathname } from "next/navigation";
import { setChainCookie, setPreviousChainCookie } from "@/actions/chain/actions";
import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

type ChainSwitcherProps = {
  height?: number;
  width?: number;
};

export default function ChainSwitcher({ height = 25, width = 25 }: ChainSwitcherProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { chain, setChain } = useChain();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  const { address } = useAppKitAccount();
  const pathname = usePathname();

  const getChainLogo = (chain: Chain) => {
    if (chain === Chain.Base) return baseLogo;
    else if (chain === Chain.Eth) return ethLogo;
    else if (chain === Chain.Solana) return solanaLogo;
    else if (chain === Chain.ApeChain) return apeChainLogo;
    else return ethLogo;
  };

  const handleChainSwitch = async (chainConfig: ChainConfig) => {
    setIsLoading(true);

    try {
      await setPreviousChainCookie(chain.name);

      if (pathname.includes("/token")) {
        router.push(`/${chainConfig.name}`);

        await setChainCookie(chainConfig.name); 
        setChain(chainConfig);

        router.refresh();

        return;
      }

      const isWalletCompatible = isWalletChainCompatible(address, chainConfig.name);

      if (!isWalletCompatible) {
        await disconnect();
        await setUserCookies(null, chain.name);
        open();
      }

      await setChainCookie(chainConfig.name);
      setChain(chainConfig);

      if (!pathname.includes("/create") && !pathname.includes("/profile")) {
        window.history.pushState({}, "", `/${chainConfig.name}`);
      }
    } catch (error) {
      Sentry.captureException(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray" placement="bottom-end">
      <DropdownTrigger>
        <div
          className={`hover:bg-gray transition rounded-lg p-1 laptop:p-2 cursor-pointer ${
            isLoading ? "opacity-50" : ""
          }`}
        >
          <Image
            className={`rounded-full transition-transform ${isLoading ? "animate-pulse" : ""}`}
            src={getChainLogo(chain.name)}
            alt="chain-logo"
            height={height}
            width={width}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu disabledKeys={["Solana"]}>
        <DropdownItem key="Base" className="dark" onPress={() => handleChainSwitch(chainConfigs.base)}>
          <div className="flex items-center gap-x-3">
            <Image src={baseLogo} alt="base-logo" height={height} width={width} />
            <p className="text-[17px]">Base</p>
          </div>
        </DropdownItem>
        <DropdownItem key="Eth" className="dark" onPress={() => handleChainSwitch(chainConfigs.eth)}>
          <div className="flex items-center gap-x-3">
            <Image src={ethLogo} alt="eth-logo" height={height} width={width} />
            <p className="text-[17px]">ETH</p>
          </div>
        </DropdownItem>
        <DropdownItem key="ApeChain" className="dark" onPress={() => handleChainSwitch(chainConfigs.apechain)}>
          <div className="flex items-center gap-x-3">
            <Image src={apeChainLogo} alt="apechain-logo" height={height} width={width} className="rounded-full"/>
            <p className="text-[17px]">ApeChain</p>
          </div>
        </DropdownItem>
        <DropdownItem key="Solana" className="dark" onPress={() => handleChainSwitch(chainConfigs.solana)}>
          <div className="flex items-center gap-x-3">
            <Image src={solanaLogo} alt="solana-logo" height={height} width={width} />
            <p className="text-[17px]">Solana</p>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
