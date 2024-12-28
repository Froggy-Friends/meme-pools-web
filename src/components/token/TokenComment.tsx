"use client";

import Image from "next/image";
import { CommentWithLikes } from "../../types/token/types";
import { User } from "@prisma/client";
import Link from "next/link";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import useCommentLike from "@/hooks/useCommentLike";
import { defaultProfileAvatarUrl } from "@/config/user";
import { getTimeDifference } from "@/lib/getTimeDifference";
import { getUserDisplayName } from "@/lib/getUserDisplayName";
import { getUserCommentInteraction } from "@/lib/getUserCommentInteraction";
import { useMemo } from "react";

type TokenCommentProps = {
  comment: CommentWithLikes;
  author: User;
  cachedUser: User | null;
  isNew?: boolean;
  tokenCreator: string;
};

export default function TokenComment({ comment, author, cachedUser, isNew, tokenCreator }: TokenCommentProps) {
  const { userCommentLike, userCommentDislike } = getUserCommentInteraction(comment, cachedUser);

  const { likes, commentLike, handleLike, dislikes, commentDisLike, handleDislike } = useCommentLike(
    comment,
    userCommentLike,
    userCommentDislike,
    comment.commentDislikeCount,
    comment.commentLikeCount
  );

  const isCreator = author.ethAddress === tokenCreator;

  return (
    <div
      className={`flex items-center justify-between w-full h-[120px] rounded-lg bg-dark px-4 mb-1 ${
        isNew ? "animate-primaryPulse" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-x-2 tablet:gap-x-4">
          <Link href={`/profile/${author.name}`}>
            <Image
              src={author.imageUrl || defaultProfileAvatarUrl}
              alt="user-profile-picture"
              height={50}
              width={50}
              className="rounded-full h-12 w-12 object-cover"
            />
          </Link>

          <div className="flex flex-col mr-2 tablet:mr-0">
            <div className="flex gap-x-2 items-center tablet:gap-x-4">
              <Link
                href={`/profile/${author.name}`}
                className="text-white/80 hover:text-white hover:underline transition"
              >
                {getUserDisplayName(author.name)}
              </Link>
              <p className="text-xs mt-1 tablet:mt-0 text-gray tablet:text-base">
                {getTimeDifference(comment.createdAt)}
              </p>
              {isCreator && (
                <span className="bg-cream rounded-3xl px-2 text-center text-xs text-black font-extrabold">Dev</span>
              )}
            </div>

            <p className="overflow-y-auto text-sm tablet:text-base max-h-[40px] tablet:max-h-[50px] max-w-[300px] tablet:max-w-[600px] laptop:max-w-[800px] desktop:max-w-[1020px]">
              {comment.message}
            </p>
          </div>
        </div>

        <div className="flex gap-x-3 mt-2 ml-14 tablet:ml-16">
          <LikeButton likes={likes} commentLike={commentLike} handleLike={handleLike} />
          <DislikeButton dislikes={dislikes} commentDisLike={commentDisLike} handleDislike={handleDislike} />
        </div>
      </div>
    </div>
  );
}
