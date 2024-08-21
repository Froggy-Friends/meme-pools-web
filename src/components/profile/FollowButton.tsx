"use client";

import { handleFollow } from "@/actions/profile/actions";
import { FollowStatus } from "@/models/follow";
import { User } from "@prisma/client";
import { useOptimistic, useState } from "react";
import toast from "react-hot-toast";

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
  const [optomisticIsFollowing, updateIsFollowing] = useOptimistic(
    isFollowing,
    (state, newIsFollowing: string) => {
      return newIsFollowing;
    }
  );
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      className="border-black p-1 border rounded-lg font-semibold w-28"
      disabled={isPending}
      onClick={async () => {
        updateIsFollowing(
          isFollowing === FollowStatus.UNFOLLOW
            ? FollowStatus.FOLLOW
            : FollowStatus.UNFOLLOW
        );
        setIsPending(true);

        const errorMessage = await handleFollow(isFollowing, user, currentUser);
        if (errorMessage) {
          toast.error(errorMessage as string)
        }
        setIsPending(false);
      }}
    >
      {!isFollowing && FollowStatus.FOLLOW}
      {optomisticIsFollowing === FollowStatus.UNFOLLOW && FollowStatus.FOLLOW}
      {optomisticIsFollowing === FollowStatus.FOLLOW && FollowStatus.UNFOLLOW}
    </button>
  );
}
