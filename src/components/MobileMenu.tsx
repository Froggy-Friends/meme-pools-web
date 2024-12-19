"use client";

import { NavbarMenu, NavbarMenuItem, Link } from "@nextui-org/react";
import CreateCoinButton from "./CreateCoinButton";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { User } from "@prisma/client";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { Chain } from "@/models/chain";
import { setUserCookies } from "@/actions/profile/actions";
import ChainSwitcher from "./ChainSwitcher";
import HowItWorksButton from "./HowItWorksButton";
import dynamic from "next/dynamic";
import { useChainSync } from "@/hooks/useChainSync";
import useSetChainCookie from "@/hooks/useSetChainCookie";

const ConnectButton = dynamic(() => import("./ConnectButton"), { ssr: false });

type MobileMenuProps = {
  cachedUser: User | null;
  currentUser: User | null;
  isConnected: boolean;
  chain: Chain;
  disconnect: () => void;
  address: string | null | undefined;
};

export default function MobileMenu({
  cachedUser,
  currentUser,
  isConnected,
  chain,
  disconnect,
  address,
}: MobileMenuProps) {
  useSetChainCookie(chain);

  return (
    <section className="tablet:hidden">
      <NavbarMenu className="bg-dark mt-6 min-w-[100vw] max-w-full left-0 right-0">
        <NavbarMenuItem>
          <div className="flex items-center justify-between -ml-4">
            {isConnected && (
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
                      if (chain === Chain.Eth) {
                        disconnect();
                        await setUserCookies(null, Chain.Eth);
                      } else if (chain === Chain.Solana) {
                        disconnect();
                        await setUserCookies(null, Chain.Solana);
                      }
                    }}
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            )}
            {!isConnected && <ConnectButton />}
            <ChainSwitcher height={40} width={40} />
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem key="profile" className="-ml-3" isActive={isConnected}>
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
          <Link
            color="foreground"
            className="w-full text-2xl mt-2"
            href="https://docs.memepools.com"
            size="lg"
            target="_blank"
          >
            Docs
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem key="terms" className="-ml-3">
          <Link
            color="foreground"
            className="w-full text-2xl mt-2"
            href="https://docs.memepools.com/terms"
            target="_blank"
            size="lg"
          >
            Terms
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem key="create-coin-button" className="mt-6 -mx-3">
          <CreateCoinButton />
        </NavbarMenuItem>
      </NavbarMenu>
    </section>
  );
}
