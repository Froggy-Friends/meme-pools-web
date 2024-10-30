"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import FollowButton from "./FollowButton";
import { User } from "@prisma/client";
import useUser from "@/hooks/useUser";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { Address } from "viem";
import useCreatorRewards from "@/hooks/useCreatorRewards";

type ProfileInfoParams = {
  profileUser: User;
  cachedUser: User | null | undefined;
  isFollowing: string;
};

export default function ProfileInfo({ profileUser, cachedUser, isFollowing }: ProfileInfoParams) {
  const { rewardAmount } = useCreatorRewards(profileUser.ethAddress as Address);
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

      <div className="flex flex-col ml-6 -mt-1" id="follow-button">
        <div className="flex items-center gap-x-5">
          <p className="text-[48px] font-semibold">{getUserDisplayName(profileUser.name)}</p>
          <p className="text-black font-bold bg-green rounded-3xl px-2 py-1 text-xs hidden tablet:block">
            ${rewardAmount} Rewards
          </p>
        </div>
        <div className="flex gap-x-4 items-center">
          {isConnected && cachedUser && cachedUser.name !== profileUser.name && (
            <FollowButton
              isFollowing={isFollowing}
              cachedUser={cachedUser}
              user={profileUser}
              className="py-1 w-32 -mt-1"
            />
          )}
          <p className="text-black font-bold bg-green rounded-3xl px-2 py-1 text-xs tablet:hidden">
            ${rewardAmount} Rewards
          </p>
        </div>
      </div>
    </section>
  );
}
