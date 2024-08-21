"use client";

import { handleFollow } from "@/actions/profile/actions";
import { FollowStatus } from "@/models/follow";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["isFollowing", currentUser.id],
    initialData: isFollowing,
  });

  const handleClick = useMutation({
    mutationKey: ["changeFollow", currentUser.id],
    mutationFn: async () => {
      const errorMessage = await handleFollow(data, user, currentUser);
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    },
    onMutate: async () => {
      const previousData = await queryClient.getQueryData([
        "isFollowing",
        currentUser.id,
      ]);

      if (previousData === FollowStatus.UNFOLLOW) {
        queryClient.setQueryData(
          ["isFollowing", currentUser.id],
          FollowStatus.FOLLOW
        );
      } else if (previousData === FollowStatus.FOLLOW) {
        queryClient.setQueryData(
          ["isFollowing", currentUser.id],
          FollowStatus.UNFOLLOW
        );
      }

      return { previousData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        ["isFollowing", currentUser.id],
        context?.previousData
      );
      toast.error((error as Error).message);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", currentUser.id],
      });
    },
  });

  return (
    <button
      className="border-black p-1 border rounded-lg font-semibold w-28"
      disabled={handleClick.isPending}
      onClick={() => handleClick.mutate()}
    >
      {!data && FollowStatus.FOLLOW}
      {data === FollowStatus.UNFOLLOW && FollowStatus.FOLLOW}
      {data === FollowStatus.FOLLOW && FollowStatus.UNFOLLOW}
    </button>
  );
}
