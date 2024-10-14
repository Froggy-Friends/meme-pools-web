"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import FollowButton from "./FollowButton";
import { User } from "@prisma/client";
import { FaXTwitter } from "react-icons/fa6";
import useUser from "@/hooks/useUser";
import { defaultProfileAvatarUrl } from "@/config/user";

type ProfileInfoParams = {
  profileUser: User;
  cachedUser: User | null | undefined;
  isFollowing: string;
};

export default function ProfileInfo({ profileUser, cachedUser, isFollowing }: ProfileInfoParams) {
  const { isConnected } = useAccount();
  const { currentUser } = useUser();
  const disabled = currentUser?.id !== profileUser.id;

  return (
    <section className="flex items-center my-6">
      <Image
        src={profileUser.imageUrl || defaultProfileAvatarUrl}
        alt="user-avatar"
        height={100}
        width={100}
        className="rounded-full"
      />

      <div className="flex flex-col items-center ml-6 -mt-1">
        <p className="text-[48px] font-semibold">{profileUser.name}</p>
        {isConnected && cachedUser && cachedUser.name !== profileUser.name && (
          <FollowButton
            isFollowing={isFollowing}
            cachedUser={cachedUser}
            user={profileUser}
            className="py-1 w-32 -mt-2"
          />
        )}
      </div>
    </section>
  );
}
