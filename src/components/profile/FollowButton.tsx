"use client";

import { handleFollow } from "@/actions/profile/actions";
import { FollowStatus } from "@/models/follow";
import { User } from "@prisma/client";
import { useState } from "react";

type FollowButtonProps = {
  isFollowing: string;
  currentUser: User;
  user: User;
};

export default function FollowButton({
  isFollowing,
  currentUser,
  user,
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <button
      className={`${
        isLoading && "border-gray-400 text-gray-400"
      } border-black p-1 border rounded-lg font-semibold w-28`}
      onClick={async () => {
        setIsLoading(true);
        await handleFollow(isFollowing, user, currentUser);
        setIsLoading(false);
      }}
    >
      {!isFollowing && FollowStatus.FOLLOW}
      {isFollowing === FollowStatus.UNFOLLOW && FollowStatus.FOLLOW}
      {isFollowing === FollowStatus.FOLLOW && FollowStatus.UNFOLLOW}
    </button>
  );
}
