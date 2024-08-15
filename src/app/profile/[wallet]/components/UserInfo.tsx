"use client";

import Image from "next/image";
import ProfileModal from "../../../../components/ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { User } from "../types";
import { Address } from "@/lib/types";
import useUser from "@/hooks/useUser";
import { useAccount } from "wagmi";
import { followUser, unfollowUser } from "../actions";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFollow } from "../queries";

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
  const [isLoading, setIsLoading] = useState(false);

  const { status, data, refetch } = useQuery({
    queryKey: ["isFollowing"],
    queryFn: async () => {
      const data = await fetchFollow(profileUser.id, currentUser?.id!);
      return data;
    },
  });

  const handleFollow = async () => {
    setIsLoading(true);

    if (data?.status === "Unfollow" && currentUser) {
      await followUser(profileUser.id, currentUser.id);
    } else if (data?.status === "Follow" && currentUser) {
      await unfollowUser(profileUser.id, currentUser.id);
    }

    await refetch();
    setIsLoading(false);
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
          currentUser!.ethAddress !== profileWalletAddress && (
            <button
              className={`${
                isLoading ? "border-gray-400 text-gray-400" : "border-black"
              } p-2 border rounded-lg font-semibold w-28`}
              onClick={() => handleFollow()}
              disabled={status === "pending"}
            >
              {!data && "Loading..."}
              {data?.status === "Unfollow" && "Follow"}
              {data?.status === "Follow" && "Unfollow"}
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
