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

type TokenCommentProps = {
  comment: CommentWithLikes;
  author: User;
  cachedUser: User | null;
  isNew?: boolean;
};

export default function TokenComment({ comment, author, cachedUser, isNew }: TokenCommentProps) {
  const { userCommentLike, userCommentDislike } = getUserCommentInteraction(comment, cachedUser);

  const { likes, commentLike, handleLike, dislikes, commentDisLike, handleDislike } = useCommentLike(
    comment,
    userCommentLike,
    userCommentDislike,
    comment.commentDislikeCount,
    comment.commentLikeCount
  );

  return (
    <div
      className={`flex items-center justify-between w-full h-[120px] rounded-lg bg-dark px-4 mb-1 ${
        isNew ? "animate-primaryPulse" : ""
      }`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-x-2 tablet:gap-x-4">
          <Image
            src={author.imageUrl || defaultProfileAvatarUrl}
            alt="user-profile-picture"
            height={50}
            width={50}
            className="rounded-full"
          />

          <div className="flex flex-col mr-2 tablet:mr-0">
            <div className="flex gap-x-2 tablet:gap-x-4">
              <Link
                href={`/profile/${author.name}`}
                className="font-proximaSoftBold text-white/80 hover:text-white hover:underline transition"
              >
                {getUserDisplayName(author.name)}
              </Link>
              <p className="text-xs mt-1 tablet:mt-0 text-gray tablet:text-base">
                {getTimeDifference(comment.createdAt)}
              </p>
            </div>

            <p className="overflow-y-auto text-sm tablet:text-base">{comment.message}</p>
          </div>
        </div>

        <div className="flex gap-x-3 mt-5 ml-14 tablet:ml-16">
          <LikeButton likes={likes} commentLike={commentLike} handleLike={handleLike} />
          <DislikeButton dislikes={dislikes} commentDisLike={commentDisLike} handleDislike={handleDislike} />
        </div>
      </div>
    </div>
  );
}
