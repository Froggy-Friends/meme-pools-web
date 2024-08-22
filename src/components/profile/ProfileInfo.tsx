"use client";

import Image from "next/image";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";

import { useAccount } from "wagmi";
import FollowButton from "./FollowButton";
import { User } from "@prisma/client";

type ProfileInfoParams = {
  profileUser: User;
  currentUser: User;
  isFollowing: string;
};

export default function ProfileInfo({
  profileUser,
  currentUser,
  isFollowing,
}: ProfileInfoParams) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isConnected } = useAccount();

  return (
    <section className="flex flex-col mx-auto">
      <div className="flex items-center gap-x-4 pb-4">
        <Image
          src={profileUser.imageUrl!}
          alt="user-avatar"
          height={40}
          width={40}
          className="rounded-full"
        />
        <p className="text-lg font-semibold">{profileUser.name}</p>
        {isConnected &&
          currentUser &&
          currentUser.name === profileUser.name && (
            <button
              onClick={() => onOpen()}
              className="p-2 border border-black rounded-lg font-semibold"
            >
              Edit profile
            </button>
          )}
        {isConnected &&
          currentUser &&
          currentUser!.name !== profileUser.name && (
            <FollowButton
              isFollowing={isFollowing}
              currentUser={currentUser}
              user={profileUser}
            />
          )}
      </div>

      {profileUser.ethAddress && (
        <p className="pb-2">{profileUser.ethAddress}</p>
      )}

      <Link
        href={`https://etherscan.io/address/${profileUser.ethAddress}`}
        className="hover:underline"
        target="_blank"
      >
        View on Etherscan
      </Link>

      <ProfileModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
      />
    </section>
  );
}
