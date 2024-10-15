"use client";

import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { CommentLikes } from "@prisma/client";
import {
  DefinedUseQueryResult,
} from "@tanstack/react-query";
import { HandleLike } from "@/types/token/types";
import useUser from "@/hooks/useUser";

type LikesButtonProps = {
  likes: DefinedUseQueryResult<number, Error>;
  commentLike: DefinedUseQueryResult<CommentLikes[], Error>;
  handleLike: HandleLike;
};

export default function LikeButton({
  likes,
  commentLike,
  handleLike,
}: LikesButtonProps) {
  const { currentUser } = useUser();

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className="hover:scale-110 active:scale-95 transition"
        disabled={handleLike.isPending || !currentUser}
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
