"use client";

import useUser from "@/hooks/useUser";
import { NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Navbar } from "@nextui-org/react";
import { useState } from "react";
import LaunchCoinButton from "./LaunchCoinButton";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { User } from "@prisma/client";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { useAccount, useDisconnect } from "wagmi";
import { Chain } from "@/models/chain";
import { useChain } from "@/context/chain";
import { useWallet } from "@solana/wallet-adapter-react";
import { setUserCookies } from "@/actions/profile/actions";
import ChainSwitcher from "./ChainSwitcher";
import HowItWorksButton from "./HowItWorksButton";
import EvmConnectButton from "./eth/EvmConnectButton";
import SolConnectButton from "./solana/SolConnectButton";

type MobileMenuProps = {
  cachedUser: User | null;
};

export default function MobileMenu({ cachedUser }: MobileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useUser();
  const { chain } = useChain();

  //evm hooks
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // sol hooks
  const { connected } = useWallet();
  const solDisconnect = useWallet().disconnect;

  return (
    <section className="tablet:hidden">
      <Navbar className="bg-dark">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="bg-dark" />
        <NavbarMenu className="bg-dark mt-6 min-w-[100vw] max-w-full left-0 right-0">
          <NavbarMenuItem>
            <div className="flex items-center justify-between -ml-4">
              {(isConnected || connected) && (
                <div className="flex items-center gap-x-2">
                  <Image
                    src={cachedUser?.imageUrl || currentUser?.imageUrl || defaultProfileAvatarUrl}
                    alt="profile-avatar"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div className="flex flex-col gap-y-[0.1rem]">
                    <p>Signed in as {getUserDisplayName(cachedUser?.name || currentUser?.name)}</p>
                    <button
                      className="bg-dark-gray rounded-lg py-[0.1rem] w-24 text-sm"
                      onClick={async () => {
                        if (chain.name === Chain.Eth) {
                          disconnect();
                          await setUserCookies(null, Chain.Eth);
                        } else if (chain.name === Chain.Solana) {
                          solDisconnect();
                          await setUserCookies(null, Chain.Solana);
                        }
                      }}
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
              {!isConnected && (chain.name === Chain.Eth || chain.name === Chain.Base) && <EvmConnectButton />}
              {!connected && chain.name === Chain.Solana && <SolConnectButton />}
              <ChainSwitcher height={40} width={40} />
            </div>
          </NavbarMenuItem>

          <NavbarMenuItem key="profile" className="-ml-3">
            <Link color="foreground" className="w-full text-2xl mt-8" href={`/profile/${currentUser?.name}`} size="lg">
              Profile
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem key="info" className="-ml-4">
            <HowItWorksButton>
              <p className="text-2xl mt-2">Info</p>
            </HowItWorksButton>
          </NavbarMenuItem>

          <NavbarMenuItem key="docs" className="-ml-3">
            <Link color="foreground" className="w-full text-2xl mt-2" href="https://docs.frog.fun" size="lg" target="_blank">
              Docs
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem key="privacy" className="-ml-3">
            <Link color="foreground" className="w-full text-2xl mt-2" href="/privacy" size="lg">
              Privacy
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem key="terms" className="-ml-3">
            <Link color="foreground" className="w-full text-2xl mt-2" href="/terms" size="lg">
              Terms
            </Link>
          </NavbarMenuItem>

          <NavbarMenuItem key="launch-coin-button" className="mt-6 -mx-3">
            <LaunchCoinButton />
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </section>
  );
}
