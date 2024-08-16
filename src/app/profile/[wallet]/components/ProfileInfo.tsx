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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFollow } from "../queries";
import toast from "react-hot-toast";

type UserInfoParams = {
  profileUser: User;
  profileWalletAddress: Address;
};

export default function ProfileInfo({
  profileUser,
  profileWalletAddress,
}: UserInfoParams) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { address, isConnected } = useAccount();
  const { currentUser } = useUser(address!);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["isFollowing"],
    queryFn: async () => {
      const data = await fetchFollow(profileUser.id, currentUser?.id!);
      return data?.status;
    },
  });

  const handleFollow = useMutation({
    mutationFn: async () => {
      const previousData = queryClient.getQueryData(["isFollowing"]);
      
      if (data === "Unfollow" && currentUser || !data && currentUser) {
        queryClient.setQueryData(["isFollowing"], "Follow");
        await followUser(profileUser.id, currentUser.id);
      } else if (data === "Follow" && currentUser) {
        queryClient.setQueryData(["isFollowing"], "Unfollow");
        await unfollowUser(profileUser.id, currentUser.id);
      }
      return { previousData };
    },
    onSettled: (context, error) => {
      if (error) {
        queryClient.setQueryData(["isFollowing"], context?.previousData);
        context?.previousData === "Unfollow" &&
          toast.error("Failed to follow user");
        context?.previousData === "Follow" &&
          toast.error("Failed to unfollow user");
      } else {
        queryClient.invalidateQueries({ queryKey: ["isFollowing"] });
      }
    },
  });

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
              className="border-black p-2 border rounded-lg font-semibold w-28"
              onClick={() => handleFollow.mutate()}
              disabled={handleFollow.isPending}
            >
              {!data && "Follow"}
              {data === "Unfollow" && "Follow"}
              {data === "Follow" && "Unfollow"}
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
