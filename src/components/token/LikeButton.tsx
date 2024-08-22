"use client";

import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { CommentWithLikes } from "../../types/token/types";
import { CommentLikes } from "@prisma/client";
import useCommentLike from "@/hooks/useCommentLike";

type LikesButtonProps = {
  likesCount: number;
  dislikesCount: number;
  comment: CommentWithLikes;
  userCommentLike: CommentLikes[];
  userCommentDislike: CommentLikes[];
};

export default function LikeButton({
  likesCount,
  dislikesCount,
  comment,
  userCommentLike,
  userCommentDislike,
}: LikesButtonProps) {
  const { likes, commentLike, handleLike } = useCommentLike(
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
        disabled={handleLike.isPending}
      >
        {commentLike.data.length === 0 ? (
          <FaRegThumbsUp size={17} onClick={() => handleLike.mutate()} />
        ) : (
          <FaThumbsUp size={17} onClick={() => handleLike.mutate()} />
        )}
      </button>

      <p>{likes.data}</p>
    </div>
  );
}
