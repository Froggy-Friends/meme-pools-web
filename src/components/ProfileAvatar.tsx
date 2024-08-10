"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import useUser from "@/hooks/useUser";

import ConnectButton from "./ConnectButton";
import defaultAvatar from "../../public/Frog.fun_Default_PFP.png";
import { User } from "@/app/profile/[wallet]/types";

type ProfileAvatarProps = {
  user: User;
};

export default function ProfileAvatar({ user }: ProfileAvatarProps) {
  const { address, isConnected } = useAccount();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { currentUser } = useUser(address!);

  return (
    <>
      {!isConnected && <ConnectButton />}
      {isConnected && !user && !currentUser && (
        <div>
          <button
            onClick={() => {
              onOpen();
            }}
          >
            <Image
              src={defaultAvatar}
              alt="profile-avatar"
              height={55}
              width={55}
              className="rounded-full"
            />
          </button>
        </div>
      )}
      {isConnected && user && (
        <div>
          <button
            onClick={() => {
              onOpen();
            }}
          >
            <Image
              src={user.imageUrl!}
              alt="profile-avatar"
              height={55}
              width={55}
              className="rounded-full"
            />
          </button>
        </div>
      )}
      {isConnected && !user && currentUser && (
        <div>
          <button
            onClick={() => {
              onOpen();
            }}
          >
            <Image
              src={currentUser.imageUrl!}
              alt="profile-avatar"
              height={55}
              width={55}
              className="rounded-full"
            />
          </button>
        </div>
      )}

      <ProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    </>
  );
}
