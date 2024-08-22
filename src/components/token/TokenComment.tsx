import Image from "next/image";
import { CommentWithLikes } from "../../types/token/types";
import { User } from "@prisma/client";
import Link from "next/link";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import { commentDateCharacterLength } from "@/config/comment";
import { getUserCommentInteraction } from "@/lib/getUserCommentInteraction";

type TokenCommentProps = {
  comment: CommentWithLikes;
  user: User;
  currentUser: User | null;
};

export default function TokenComment({ comment, user, currentUser }: TokenCommentProps) {
  const { userCommentLike, userCommentDislike } = getUserCommentInteraction(
    comment,
    currentUser!
  );

  return (
    <div className="flex flex-col pb-4 mb-1 w-full rounded-lg bg-gray-950/95 p-2 text-white">
      <div className="flex gap-x-3">
        <Image
          src={user.imageUrl!}
          alt="user-profile-picture"
          height={25}
          width={25}
          className="rounded-full"
        />
        <Link href={`/profile/${user.name}`} className="hover:underline">
          {user.name}
        </Link>
        <p>
          {comment.createdAt
            .toString()
            .substring(0, commentDateCharacterLength)}
        </p>
        <LikeButton
          dislikesCount={comment.commentDislikeCount}
          likesCount={comment.commentLikeCount}
          comment={comment}
          userCommentLike={userCommentLike}
          userCommentDislike={userCommentDislike}
        />
        <DislikeButton
          dislikesCount={comment.commentDislikeCount}
          likesCount={comment.commentLikeCount}
          comment={comment}
          userCommentLike={userCommentLike}
          userCommentDislike={userCommentDislike}
        />
      </div>

      <p className="mt-2">{comment.message}</p>
    </div>
  );
}
