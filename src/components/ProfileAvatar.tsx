"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import useUser from "@/hooks/useUser";
import EvmConnectButton from "./eth/EvmConnectButton";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import SolConnectButton from "./solana/SolConnectButton";
import { Chain } from "@/models/chain";
import { User } from "@prisma/client";
import Image from "next/image";
import { useChain } from "@/context/chain";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { setUserCookies } from "@/actions/profile/actions";

type ProfileAvatarProps = {
  user: User;
};

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { currentUser } = useUser();
  const { connected } = useWallet();
  const solDisconnect = useWallet().disconnect;
  const { chain } = useChain();

  return (
    <Dropdown className="min-w-0 w-fit py-2 px-3 bg-dark-gray" placement="bottom-end">
      {!isConnected && chain === Chain.Eth && <EvmConnectButton />}
      {!connected && chain === Chain.Solana && <SolConnectButton />}
      <DropdownTrigger>
        <div className="hover:bg-gray rounded-lg p-2 cursor-pointer">
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
          <p className="text-lg">
            {user && `Signed in as ${getUserDisplayName(user)}`}
            {!user && currentUser && `Signed in as ${getUserDisplayName(currentUser)}`}
          </p>
        </DropdownItem>
        <DropdownItem
          className="dark"
          key="Profile"
          onPress={() => router.push(`/profile/${user ? user.name : currentUser?.name}`)}
        >
          <p className="text-[17px]">Profile</p>
        </DropdownItem>
        <DropdownItem key="Portfolio" className="hover:cursor-default" isReadOnly>
          <p className="text-[17px] text-white/[20%] hover:cursor-default">Portfolio</p>
        </DropdownItem>
        <DropdownItem
          className="dark"
          key="Disconnect"
          onPress={async () => {
            if (chain === Chain.Eth) {
              disconnect();
              await setUserCookies(null, Chain.Eth);
            } else if (chain === Chain.Solana) {
              solDisconnect();
              await setUserCookies(null, Chain.Solana);
            }
          }}
        >
          <p className="text-[17px]">Disconnect</p>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
