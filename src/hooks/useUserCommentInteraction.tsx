import { CommentWithLikes } from "@/types/token/types";
import { CommentLikes, User } from "@prisma/client";
import useUser from "./useUser";

export default function useUserCommentInteraction(
  comment: CommentWithLikes,
  user: User
) {
  const { currentUser } = useUser();
  let userCommentLike: CommentLikes[] = [];
  let userCommentDislike: CommentLikes[] = [];

  if (user) {
    userCommentLike = comment.commentLikes.filter((commentLike) => {
      return commentLike.userId === user?.id && commentLike.status === "like";
    });
    userCommentDislike = comment.commentLikes.filter((commentLike) => {
      return (
        commentLike.userId === user?.id && commentLike.status === "dislike"
      );
    });
  } else if (!user && currentUser) {
    userCommentLike = comment.commentLikes.filter((commentLike) => {
      return (
        commentLike.userId === currentUser?.id && commentLike.status === "like"
      );
    });
    userCommentDislike = comment.commentLikes.filter((commentLike) => {
      return (
        commentLike.userId === currentUser?.id &&
        commentLike.status === "dislike"
      );
    });
  }

  return { userCommentLike, userCommentDislike };
}
