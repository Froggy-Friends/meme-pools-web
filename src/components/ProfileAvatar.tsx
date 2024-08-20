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
import EvmConnectButton from "./base/EvmConnectButton";
import defaultAvatar from "../../public/Frog.fun_Default_PFP.png";
import { Address } from "@coinbase/onchainkit/identity";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import SolConnectButton from "./solana/SolConnectButton";
import { Chains } from "@/models/chains";
import { User } from "@prisma/client";

type ProfileAvatarProps = {
  user: User;
  chain: Chains;
};

export default function ProfileAvatar({ user, chain }: ProfileAvatarProps) {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { currentUser } = useUser();
  const { publicKey, connected } = useWallet();
  const solDisconnet = useWallet().disconnect;

  return (
    <Dropdown>
      {!isConnected && chain === Chains.Base && <EvmConnectButton />}
      {!connected && chain === Chains.Solana && <SolConnectButton />}
      {isConnected && !user && !currentUser && chain === Chains.Base && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={defaultAvatar.toString()}
            size="lg"
          />
        </DropdownTrigger>
      )}
      {connected && !user && !currentUser && chain === Chains.Solana && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={defaultAvatar.toString()}
            size="lg"
          />
        </DropdownTrigger>
      )}
      {isConnected && user && chain === Chains.Base && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={user.imageUrl!}
            size="lg"
          />
        </DropdownTrigger>
      )}
      {connected && user && chain === Chains.Solana && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={user.imageUrl!}
            size="lg"
          />
        </DropdownTrigger>
      )}
      {isConnected && !user && currentUser && chain === Chains.Base && (
        <DropdownTrigger>
          <Avatar
            as="button"
            className="transition-transform"
            src={currentUser.imageUrl!}
            size="lg"
          />
        </DropdownTrigger>
      )}
      {connected && !user && currentUser && chain === Chains.Solana && (
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
          {chain === Chains.Base && (
            <Address address={address} isSliced={true} />
          )}
          {chain === Chains.Solana && (
            <p>{publicKey?.toString().substring(0, 6)}</p>
          )}
        </DropdownItem>
        <DropdownItem
          key="Profile"
          onPress={() =>
            router.push(`/profile/${user ? user.name : currentUser?.name}`)
          }
        >
          Profile
        </DropdownItem>
        <DropdownItem
          key="Disconnect"
          onPress={() => {
            chain === Chains.Base && disconnect();
            chain === Chains.Solana && solDisconnet();
          }}
        >
          Disconnect
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
