"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import useUser from "@/hooks/useUser";
import EvmConnectButton from "./eth/EvmConnectButton";
import { useWallet } from "@solana/wallet-adapter-react";
import SolConnectButton from "./solana/SolConnectButton";
import { Chain } from "@/models/chain";
import { User } from "@prisma/client";
import Image from "next/image";
import { useChain } from "@/context/chain";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { setUserCookies } from "@/actions/profile/actions";
import Link from "next/link";

type ProfileAvatarProps = {
  user: User;
};

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  const { chain } = useChain();
  const { currentUser } = useUser();

  // evm hooks
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // sol hooks
  const { connected } = useWallet();
  const solDisconnect = useWallet().disconnect;

  return (
    <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray" placement="bottom-end">
      {!isConnected && chain.name === Chain.Eth && <EvmConnectButton />}
      {!connected && chain.name === Chain.Solana && <SolConnectButton />}
      <DropdownTrigger>
        <div className="hover:bg-gray rounded-lg p-1 laptop:p-2 cursor-pointer">
          <Image
            className="transition-transform rounded-full"
            src={user?.imageUrl || defaultProfileAvatarUrl}
            alt="profile-avatar"
            height={25}
            width={25}
          />
        </div>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="Account" isReadOnly className="hover:cursor-default">
          <p className="text-sm tablet:text-base">
            {user && `Signed in as ${getUserDisplayName(user.name)}`}
            {!user && currentUser && `Signed in as ${getUserDisplayName(currentUser.name)}`}
          </p>
        </DropdownItem>
        <DropdownItem className="dark" key="Profile">
          <Link href={`/profile/${user ? user.name : currentUser?.name}`}>
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
            if (chain.name === Chain.Eth) {
              disconnect();
              await setUserCookies(null, Chain.Eth);
            } else if (chain.name === Chain.Solana) {
              solDisconnect();
              await setUserCookies(null, Chain.Solana);
            }
          }}
        >
          <p className="text-sm tablet:text-base">Disconnect</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
