"use client";

import { FaThumbsDown, FaRegThumbsDown } from "react-icons/fa6";
import { HandleDislike } from "../../types/token/types";
import { CommentLikes } from "@prisma/client";
import { DefinedUseQueryResult } from "@tanstack/react-query";
import useUser from "@/hooks/useUser";

type DislikeButtonProps = {
  dislikes: DefinedUseQueryResult<number, Error>;
  commentDisLike: DefinedUseQueryResult<CommentLikes[], Error>;
  handleDislike: HandleDislike;
};

export default function DislikeButton({
  dislikes,
  commentDisLike,
  handleDislike,
}: DislikeButtonProps) {
  const { currentUser } = useUser();

  return (
    <div className="flex gap-x-2 items-center">
      <button
        className="hover:scale-110 active:scale-95 transition"
        disabled={handleDislike.isPending || !currentUser}
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
