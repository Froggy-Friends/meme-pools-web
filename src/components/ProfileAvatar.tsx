"use client";

import { useAccount, useDisconnect } from "wagmi";
import { Avatar } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import useUser from "@/hooks/useUser";
import ConnectButton from "./ConnectButton";
import defaultAvatar from "../../public/Frog.fun_Default_PFP.png";
import { User } from "@/app/profile/[wallet]/types";
import { Address } from "@coinbase/onchainkit/identity";
import { useRouter } from "next/navigation";

type ProfileAvatarProps = {
  user: User;
};

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { currentUser } = useUser(address!);

  return (
    <Dropdown>
      {!isConnected && <ConnectButton />}
      {isConnected && !user && !currentUser && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={defaultAvatar.toString()}
            size="lg"
          />
        </DropdownTrigger>
      )}
      {isConnected && user && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={user.imageUrl!}
            size="lg"
          />
        </DropdownTrigger>
      )}
      {isConnected && !user && currentUser && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={currentUser.imageUrl!}
            size="lg"
          />
        </DropdownTrigger>
      )}
      <DropdownMenu>
        <DropdownItem key="Account" isReadOnly className="hover:cursor-default">
          <Address address={address} isSliced={true} />
        </DropdownItem>
        <DropdownItem
          key="Profile"
          onPress={() => router.push(`/profile/${user ? user.ethAddress : currentUser?.ethAddress}`)}
        >
          Profile
        </DropdownItem>
        <DropdownItem key="Disconnect" onPress={() => disconnect()}>
          Disconnect
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
