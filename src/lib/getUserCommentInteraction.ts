import { CommentWithLikes } from "@/types/token/types";
import { User } from "@prisma/client";

export const getUserCommentInteraction = (
  comment: CommentWithLikes,
  currentUser: User | null
) => {
  if (!currentUser) return { userCommentLike: [], userCommentDislike: [] };

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

  return { userCommentLike, userCommentDislike };
};
