import { CommentWithLikes } from "@/app/token/[tokenAddress]/types";
import { User } from "@prisma/client";

export const getUserCommentInteraction = (
  comment: CommentWithLikes,
  currentUser: User,
) => {

  const userCommentLike = comment.commentLikes.filter((commentLike) => {
    return (
      commentLike.userId === currentUser?.id && commentLike.status === "like"
    );
  });

  const userCommentDislike = comment.commentLikes.filter((commentLike) => {
    return (
      commentLike.userId === currentUser?.id && commentLike.status === "dislike"
    );
  });

  return { userCommentLike, userCommentDislike }
};
