"use client";

import { useAccount, useDisconnect } from "wagmi";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import useUser from "@/hooks/useUser";
import EvmConnectButton from "./base/EvmConnectButton";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import SolConnectButton from "./solana/SolConnectButton";
import { Chain } from "@/models/chain";
import { User } from "@prisma/client";
import Image from "next/image";
import { useChain } from "@/context/chain";
import { defaultProfileAvatarUrl } from "@/config/user";

type ProfileAvatarProps = {
  user: User;
};

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { currentUser } = useUser();
  const { publicKey, connected } = useWallet();
  const solDisconnet = useWallet().disconnect;
  const { chain } = useChain();

  return (
    <Dropdown
      className="min-w-0 w-fit py-2 px-3 bg-dark-gray"
      placement="bottom-end"
    >
      {!isConnected && chain === Chain.Base && <EvmConnectButton />}
      {!connected && chain === Chain.Solana && <SolConnectButton />}
      {isConnected && !user && !currentUser && chain === Chain.Base && (
        <DropdownTrigger>
          <div className="bg-dark-gray hover:bg-gray rounded-lg p-2 cursor-pointer">
            <Image
              className="transition-transform rounded-full"
              src={defaultProfileAvatarUrl}
              alt="profile-avatar"
              height={45}
              width={45}
            />
          </div>
        </DropdownTrigger>
      )}
      {connected && !user && !currentUser && chain === Chain.Solana && (
        <DropdownTrigger>
          <div className="bg-dark-gray hover:bg-gray rounded-lg p-2 cursor-pointer">
            <Image
              className="transition-transform rounded-full"
              src={defaultProfileAvatarUrl}
              alt="profile-avatar"
              height={45}
              width={45}
            />
          </div>
        </DropdownTrigger>
      )}
      {isConnected && user && chain === Chain.Base && (
        <DropdownTrigger>
          <div className="bg-dark-gray hover:bg-gray rounded-lg p-2 cursor-pointer">
            <Image
              className="transition-transform rounded-full"
              src={user.imageUrl || defaultProfileAvatarUrl}
              alt="profile-avatar"
              height={45}
              width={45}
            />
          </div>
        </DropdownTrigger>
      )}
      {connected && user && chain === Chain.Solana && (
        <DropdownTrigger>
          <div className="bg-dark-gray hover:bg-gray rounded-lg p-2 cursor-pointer">
            <Image
              className="transition-transform rounded-full"
              src={user.imageUrl || defaultProfileAvatarUrl}
              alt="profile-avatar"
              height={45}
              width={45}
            />
          </div>
        </DropdownTrigger>
      )}
      {isConnected && !user && currentUser && chain === Chain.Base && (
        <DropdownTrigger>
          <div className="bg-dark-gray hover:bg-gray rounded-lg p-2 cursor-pointer">
            <Image
              className="transition-transform rounded-full"
              src={currentUser.imageUrl || defaultProfileAvatarUrl}
              alt="profile-avatar"
              height={45}
              width={45}
            />
          </div>
        </DropdownTrigger>
      )}
      {connected && !user && currentUser && chain === Chain.Solana && (
        <DropdownTrigger>
          <div className="bg-dark-gray hover:bg-gray rounded-lg p-2 cursor-pointer">
            <Image
              className="transition-transform rounded-full"
              src={currentUser.imageUrl || defaultProfileAvatarUrl}
              alt="profile-avatar"
              height={45}
              width={45}
            />
          </div>
        </DropdownTrigger>
      )}
      <DropdownMenu>
        <DropdownItem key="Account" isReadOnly className="hover:cursor-default">
          <p className="text-[17px]">
            Signed in as {user ? user.name : currentUser?.name}
          </p>
        </DropdownItem>
        <DropdownItem
          key="Profile"
          onPress={() =>
            router.push(`/profile/${user ? user.name : currentUser?.name}`)
          }
        >
          Profile
        </DropdownItem>
        <DropdownItem key="Portfolio" isReadOnly>
          <p className="text-white/[20%]">Portfolio</p>
        </DropdownItem>
        <DropdownItem
          key="Disconnect"
          onPress={() => {
            chain === Chain.Base && disconnect();
            chain === Chain.Solana && solDisconnet();
          }}
        >
          Disconnect
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
