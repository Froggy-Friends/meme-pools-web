"use client";

import { FaThumbsDown, FaRegThumbsDown } from "react-icons/fa6";
import { CommentWithLikes } from "../../types/token/types";
import { CommentLikes } from "@prisma/client";
import useCommentLike from "@/hooks/useCommentLike";

type DislikeButtonProps = {
  dislikesCount: number;
  likesCount: number;
  comment: CommentWithLikes;
  userCommentLike: CommentLikes[];
  userCommentDislike: CommentLikes[];
};

export default function DislikeButton({
  dislikesCount,
  likesCount,
  comment,
  userCommentLike,
  userCommentDislike,
}: DislikeButtonProps) {
  const { dislikes, commentDisLike, handleDislike } = useCommentLike(
    comment,
    userCommentLike,
    userCommentDislike,
    dislikesCount,
    likesCount
  );

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className="hover:scale-110 active:scale-95 transition"
        disabled={handleDislike.isPending}
      >
        {commentDisLike.data.length === 0 ? (
          <FaRegThumbsDown size={17} onClick={() => handleDislike.mutate()} />
        ) : (
          <FaThumbsDown size={17} onClick={() => handleDislike.mutate()} />
        )}
      </button>

      <p>{dislikes.data}</p>
    </div>
  );
}
