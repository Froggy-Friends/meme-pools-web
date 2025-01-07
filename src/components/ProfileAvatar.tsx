"use client";

import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Chain } from "@/models/chain";
import { User } from "@prisma/client";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { setUserCookies } from "@/actions/profile/actions";
import Link from "next/link";
import dynamic from "next/dynamic";

const ConnectButton = dynamic(() => import("./ConnectButton"), { ssr: false });

type ProfileAvatarProps = {
  cachedUser: User | null;
  currentUser: User | null;
  isConnected: boolean;
  chain: Chain;
  disconnect: () => void;
  address: string | null | undefined;
};

export default function ProfileAvatar({
  cachedUser,
  currentUser,
  isConnected,
  chain,
  disconnect,
  address,
}: ProfileAvatarProps) {
  return (
    <section className="hidden tablet:block">
      <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray" placement="bottom-end">
        {!isConnected && <ConnectButton />}
        <DropdownTrigger>
          <div className="hover:bg-gray rounded-lg p-1 laptop:p-2 cursor-pointer">
            <Image
              className="transition-transform rounded-full"
              src={cachedUser?.imageUrl || defaultProfileAvatarUrl}
              alt="profile-avatar"
              height={25}
              width={25}
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem key="Account" isReadOnly className="hover:cursor-default">
            <p className="text-sm tablet:text-base">
              {cachedUser && `Signed in as ${getUserDisplayName(cachedUser.name)}`}
              {!cachedUser && currentUser && `Signed in as ${getUserDisplayName(currentUser.name)}`}
            </p>
          </DropdownItem>
          <DropdownItem className="dark" key="Profile">
            <Link href={`/profile/${cachedUser ? cachedUser.name : currentUser?.name}`}>
              <p className="text-sm tablet:text-base">Profile</p>
            </Link>
          </DropdownItem>
          <DropdownItem key="Portfolio" className="hover:cursor-default" isReadOnly>
            <p className="text-sm tablet:text-base text-white/[20%] hover:cursor-default">Portfolio</p>
          </DropdownItem>
          <DropdownItem
            className="dark"
            key="Disconnect"
            onPress={async () => {
              if (chain === Chain.Eth || chain === Chain.Base || chain === Chain.ApeChain) {
                disconnect();
                await setUserCookies(null, Chain.Eth);
              } else if (chain === Chain.Solana) {
                disconnect();
                await setUserCookies(null, Chain.Solana);
              }
            }}
          >
            <p className="text-sm tablet:text-base">Disconnect</p>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </section>
  );
}
