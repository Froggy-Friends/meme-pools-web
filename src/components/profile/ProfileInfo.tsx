"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import FollowButton from "./FollowButton";
import { User } from "@prisma/client";
import { FaXTwitter } from "react-icons/fa6";
import EditProfileForm from "./EditProfileForm";

type ProfileInfoParams = {
  profileUser: User;
  cachedUser: User | null;
  isFollowing: string;
};

export default function ProfileInfo({
  profileUser,
  cachedUser,
  isFollowing,
}: ProfileInfoParams) {
  const { isConnected } = useAccount();

  return (
    <section className="flex">
      <div className="flex flex-col items-center mt-6 gap-y-5">
        <Image
          src={profileUser.imageUrl!}
          alt="user-avatar"
          height={120}
          width={120}
          className="rounded-full"
        />

        <button className="flex gap-x-2 justify-center items-center bg-dark-gray border-[0.25px] border-white/[5%] rounded-3xl w-36 py-2 text-lg hover:bg-gray transition">
          <p>Connect</p> <FaXTwitter size={20} />
        </button>

        {isConnected &&
          cachedUser &&
          cachedUser!.name !== profileUser.name && (
            <FollowButton
              isFollowing={isFollowing}
              cachedUser={cachedUser}
              user={profileUser}
            />
          )}
      </div>

      <EditProfileForm profileUser={profileUser} />
    </section>
  );
}
