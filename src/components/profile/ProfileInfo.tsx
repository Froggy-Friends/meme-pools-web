"use client";

import Image from "next/image";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import { User } from "../../app/profile/[username]/types";
import useUser from "@/hooks/useUser";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";
import { FollowStatus } from "@/models/follow";
import { fetchFollow } from "@/queries/profile/queries";
import { followUser, unfollowUser } from "@/actions/profile/actions";

type ProfileInfoParams = {
  profileUser: User;
};

export default function ProfileInfo({ profileUser }: ProfileInfoParams) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { isConnected } = useAccount();
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["isFollowing"],
    queryFn: async () => {
      const data = await fetchFollow(profileUser.id, currentUser?.id!);
      return data?.status;
    },
  });

  const handleFollow = async () => {
    try {
      setLoading(true);
      if (
        (data === FollowStatus.UNFOLLOW && currentUser) ||
        (!data && currentUser)
      ) {
        await followUser(profileUser.id, currentUser.id);
      } else if (data === FollowStatus.FOLLOW && currentUser) {
        await unfollowUser(profileUser.id, currentUser.id);
      }
      await refetch();
      setLoading(false);
    } catch (error) {
      data === FollowStatus.UNFOLLOW && toast.error("Failed to follow user");
      data === FollowStatus.FOLLOW && toast.error("Failed to unfollow user");
    }
  };

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
          !isLoading &&
          currentUser &&
          currentUser!.name !== profileUser.name && (
            <button
              className={`${
                loading ? "border-gray-400 text-gray-400" : "border-black"
              } p-2 border rounded-lg font-semibold w-28`}
              onClick={() => handleFollow()}
              disabled={isLoading}
            >
              {!data && !isLoading && FollowStatus.FOLLOW}
              {data === FollowStatus.UNFOLLOW && FollowStatus.FOLLOW}
              {data === FollowStatus.FOLLOW && FollowStatus.UNFOLLOW}
            </button>
          )}
        {isLoading && (
          <div className="bg-gray-300 h-10 w-28 animate-pulse rounded-lg" />
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
