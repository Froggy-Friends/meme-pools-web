"use client";

import { handleFollow } from "@/actions/profile/actions";
import { FollowStatus } from "@/models/follow";
import { cn } from "@nextui-org/react";
import { User } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type FollowButtonProps = {
  isFollowing: string;
  cachedUser: User;
  user: User;
  className?: string;
};

export default function FollowButton({ isFollowing, cachedUser, user, className }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["isFollowing", cachedUser.id, user.id],
    initialData: isFollowing,
  });

  const handleClick = useMutation({
    mutationKey: ["changeFollow", cachedUser.id, user.id],
    mutationFn: async () => {
      const errorMessage = await handleFollow(data, user, cachedUser);
      if (errorMessage) {
        throw new Error(errorMessage);
      }
    },
    onMutate: async () => {
      const previousData = await queryClient.getQueryData(["isFollowing", cachedUser.id, user.id]);

      if (previousData === FollowStatus.UNFOLLOW || previousData === "false") {
        queryClient.setQueryData(["isFollowing", cachedUser.id, user.id], FollowStatus.FOLLOW);
      } else if (previousData === FollowStatus.FOLLOW) {
        queryClient.setQueryData(["isFollowing", cachedUser.id, user.id], FollowStatus.UNFOLLOW);
      }

      return { previousData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["isFollowing", cachedUser.id, user.id], context?.previousData);
      toast.error((error as Error).message);
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["isFollowing", cachedUser.id, user.id],
      });
    },
  });

  return (
    <button
      className={cn(
        "text-xl rounded-xl py-2 w-36 text-dark font-proximaSoftBold active:scale-[0.98] transition",
        data && data !== FollowStatus.FOLLOW && "bg-cream/85  hover:bg-cream",
        data === FollowStatus.FOLLOW &&
          "bg-dark text-white font-proximaSoft border-[0.25px] border-white/[5%] hover:bg-red/[4%] hover:text-red hover:border-red transition",
        className
      )}
      disabled={handleClick.isPending}
      onClick={() => handleClick.mutate()}
    >
      {data === "false" && FollowStatus.FOLLOW}
      {data === FollowStatus.UNFOLLOW && FollowStatus.FOLLOW}
      {data === FollowStatus.FOLLOW && FollowStatus.UNFOLLOW}
    </button>
  );
}
