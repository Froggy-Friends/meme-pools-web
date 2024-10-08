"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import FollowButton from "./FollowButton";
import { User } from "@prisma/client";
import { FaXTwitter } from "react-icons/fa6";
import EditProfileForm from "./EditProfileForm";
import useUser from "@/hooks/useUser";
import { defaultProfileAvatarUrl } from "@/config/user";

type ProfileInfoParams = {
  profileUser: User;
  cachedUser: User | null;
  isFollowing: string;
};

export default function ProfileInfo({ profileUser, cachedUser, isFollowing }: ProfileInfoParams) {
  const { isConnected } = useAccount();
  const { currentUser } = useUser();
  const disabled = currentUser?.id !== profileUser.id;

  return (
    <section className="flex flex-col laptop:flex-row">
      <div className="flex flex-col items-center mt-6 gap-y-5">
        <Image
          src={profileUser.imageUrl || defaultProfileAvatarUrl}
          alt="user-avatar"
          height={120}
          width={120}
          className="rounded-full"
        />

        <button
          className={`${
            disabled && "cursor-not-allowed hover:bg-dark-gray"
          } flex gap-x-2 justify-center items-center bg-dark-gray border-[0.25px] border-white/[5%] rounded-3xl w-36 py-2 text-lg hover:bg-gray transition`}
          disabled={disabled}
        >
          <p>Connect</p> <FaXTwitter size={20} />
        </button>

        {isConnected && cachedUser && cachedUser.name !== profileUser.name && (
          <FollowButton isFollowing={isFollowing} cachedUser={cachedUser} user={profileUser} />
        )}
      </div>

      <EditProfileForm profileUser={profileUser} />
    </section>
  );
}
