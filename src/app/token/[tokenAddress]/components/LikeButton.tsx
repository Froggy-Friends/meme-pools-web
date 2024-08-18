import useUser from "@/hooks/useUser";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { useAccount } from "wagmi";
import { addCommentLike, removeCommentLike } from "../actions";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { fetchCommentLike } from "../queries";
import { useState } from "react";

type LikesButtonProps = {
  likesCount: number;
  commentId: string;
};

export default function LikeButton({
  likesCount,
  commentId,
}: LikesButtonProps) {
  const { address } = useAccount();
  const { currentUser } = useUser(address!);
  const [optiomisticLikesCount, setOptomisticLikesCount] = useState(likesCount);

  const { data, refetch, isPending } = useQuery({
    queryKey: ["commentLike", commentId],
    queryFn: async () => {
      const data = await fetchCommentLike(currentUser?.id!, commentId, "like");
      return data?.id || null;
    },
  });

  const handleLike = async () => {
    try {
      if (!data) {
        setOptomisticLikesCount(optiomisticLikesCount + 1);
        await addCommentLike(currentUser?.id!, commentId, "like");
      } else {
        setOptomisticLikesCount(optiomisticLikesCount - 1);
        await removeCommentLike(data);
      }
      await refetch();
    } catch (error) {
      setOptomisticLikesCount(likesCount);
      !data && toast.error("Error liking comment");
      data && toast.error("Error removing comment like");
    }
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button
        disabled={isPending}
        className="hover:scale-110 active:scale-95 transition"
      >
        {!data || (!data && isPending) ? (
          <FaRegThumbsUp size={17} onClick={() => handleLike()} />
        ) : (
          <FaThumbsUp size={17} onClick={() => handleLike()} />
        )}
      </button>

      <p>{optiomisticLikesCount}</p>
    </div>
  );
}
