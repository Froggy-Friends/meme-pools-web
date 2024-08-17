import Image from "next/image";
import { CommentWithLikes } from "../types";
import { User } from "@prisma/client";
import Link from "next/link";

type TokenCommentProps = {
  comment: CommentWithLikes;
  user: User;
};

const convertDate = (date: string) => {
  const newDate = date.split("G");
  return newDate[0];
};

export default function TokenComment({ comment, user }: TokenCommentProps) {
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
        <Link href={`/profile/${user.ethAddress}`} className="hover:underline">
          {user.name}
        </Link>
        <p>{convertDate(comment.createdAt.toString())}</p>
        <p>Likes...</p>
      </div>

      <p className="mt-2">{comment.message}</p>
    </div>
  );
}
