"use client";

import Image from "next/image";
import ProfileModal from "../../../../components/ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { User } from "../types";
import { Address } from "@/lib/types";
import useUser from "@/hooks/useUser";
import useIsFollowingUser from "@/hooks/useIsFollowingUser";
import { useAccount } from "wagmi";
import { followUser, unfollowUser } from "../actions";

type UserInfoParams = {
  profileUser: User;
  profileWalletAddress: Address;
};

export default function UserInfo({
  profileUser,
  profileWalletAddress,
}: UserInfoParams) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const { currentUser } = useUser(address!);
  const { following, checkFollowing, isLoading } = useIsFollowingUser(
    profileUser.id,
    currentUser?.id || ""
  );

  const handleFollow = async () => {
    if (!following && currentUser) {
      followUser(profileUser.id, currentUser.id);
      await checkFollowing();
    } else if (following && currentUser) {
      unfollowUser(profileUser.id, currentUser.id);
      await checkFollowing();
    }
  };

  return (
    <section className="items-center">
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
          currentUser.ethAddress === profileWalletAddress && (
            <button
              onClick={() => onOpen()}
              className="p-2 border border-black rounded-lg font-semibold"
            >
              Edit profile
            </button>
          )}
        {isConnected &&
          currentUser &&
          following !== null &&
          currentUser!.ethAddress !== profileWalletAddress && (
            <button
              className={`${isLoading ? "border-gray-400 text-gray-400" : "border-black"} p-2 border rounded-lg font-semibold w-28`}
              onClick={() => handleFollow()}
              disabled={isLoading}
            >
              {!following  && "Follow"}
              {following  && "Unfollow"}
            </button>
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
