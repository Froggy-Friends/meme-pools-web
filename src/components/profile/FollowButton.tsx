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
    queryKey: ["isFollowing", currentUser.id, user.id],
    initialData: isFollowing,
  });

  const handleClick = useMutation({
    mutationKey: ["changeFollow", currentUser.id, user.id],
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
        user.id,
      ]);

      if (previousData === FollowStatus.UNFOLLOW || previousData === "false") {
        queryClient.setQueryData(
          ["isFollowing", currentUser.id, user.id],
          FollowStatus.FOLLOW
        );
      } else if (previousData === FollowStatus.FOLLOW) {
        queryClient.setQueryData(
          ["isFollowing", currentUser.id, user.id],
          FollowStatus.UNFOLLOW
        );
      }

      return { previousData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        ["isFollowing", currentUser.id, user.id],
        context?.previousData
      );
      toast.error((error as Error).message);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", currentUser.id, user.id],
      });
    },
  });

  return (
    <button
      className="bg-green text-dark font-proximaSoftBold text-xl rounded-3xl py-2 w-36 hover:bg-light-green active:scale-[0.98] transition"
      disabled={handleClick.isPending}
      onClick={() => handleClick.mutate()}
    >
      {data === "false" && FollowStatus.FOLLOW}
      {data === FollowStatus.UNFOLLOW && FollowStatus.FOLLOW}
      {data === FollowStatus.FOLLOW && FollowStatus.UNFOLLOW}
    </button>
  );
}
