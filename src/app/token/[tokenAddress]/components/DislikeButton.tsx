import useUser from "@/hooks/useUser";
import { FaThumbsDown, FaRegThumbsDown } from "react-icons/fa6";
import { useAccount } from "wagmi";
import { addCommentLike, removeCommentLike } from "../actions";
import { useQuery } from "@tanstack/react-query";
import { fetchCommentLike } from "../queries";
import toast from "react-hot-toast";
import { useState } from "react";

type DislikeButtonProps = {
  dislikesCount: number;
  commentId: string;
};

export default function DislikeButton({
  dislikesCount,
  commentId,
}: DislikeButtonProps) {
  const { address } = useAccount();
  const { currentUser } = useUser(address!);
  const [optiomisticDislikesCount, setOptomisticDislikesCount] =
    useState(dislikesCount);

  const { data, refetch, isPending } = useQuery({
    queryKey: ["commentDislike", commentId],
    queryFn: async () => {
      const data = await fetchCommentLike(
        currentUser?.id!,
        commentId,
        "dislike"
      );
      return data?.id || null;
    },
  });

  const handleDislike = async () => {
    try {
      if (!data) {
        setOptomisticDislikesCount(optiomisticDislikesCount + 1);
        await addCommentLike(currentUser?.id!, commentId, "dislike");
      } else {
        setOptomisticDislikesCount(optiomisticDislikesCount - 1);
        await removeCommentLike(data);
      }
      await refetch();
    } catch (error) {
      setOptomisticDislikesCount(dislikesCount);
      !data && toast.error("Error disliking comment");
      data && toast.error("Error removing comment dislike");
    }
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        disabled={isPending}
        className="hover:scale-110 active:scale-95 transition"
      >
        {!data || (!data && isPending) ? (
          <FaRegThumbsDown size={17} onClick={() => handleDislike()} />
        ) : (
          <FaThumbsDown size={17} onClick={() => handleDislike()} />
        )}
      </button>

      <p>{optiomisticDislikesCount}</p>
    </div>
  );
}
