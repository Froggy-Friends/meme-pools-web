import useUser from "@/hooks/useUser";
import { FaThumbsDown, FaRegThumbsDown } from "react-icons/fa6";
import { addCommentLike, removeCommentLike } from "../actions";
import toast from "react-hot-toast";
import { CommentWithLikes } from "../types";
import { getUserCommentInteraction } from "@/lib/getUserCommentInteraction";

type DislikeButtonProps = {
  dislikesCount: number;
  commentId: string;
  comment: CommentWithLikes;
};

export default function DislikeButton({
  dislikesCount,
  commentId,
  comment,
}: DislikeButtonProps) {
  const { currentUser } = useUser();
  const { userCommentLike, userCommentDislike } = getUserCommentInteraction(
    comment,
    currentUser!
  );

  const handleDislike = async () => {
    try {
      if (userCommentDislike.length === 0 && userCommentLike.length > 0) {
        await addCommentLike(
          currentUser?.id!,
          commentId,
          "dislike",
          userCommentLike[0].id
        );
      } else if (userCommentDislike.length === 0) {
        await addCommentLike(currentUser?.id!, commentId, "dislike");
      } else {
        await removeCommentLike(userCommentDislike[0].id);
      }
    } catch (error) {
      userCommentDislike.length === 0 && toast.error("Error disliking comment");
      userCommentDislike.length > 0 &&
        toast.error("Error removing comment dislike");
    }
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button className="hover:scale-110 active:scale-95 transition">
        {userCommentDislike.length === 0 ? (
          <FaRegThumbsDown size={17} onClick={() => handleDislike()} />
        ) : (
          <FaThumbsDown size={17} onClick={() => handleDislike()} />
        )}
      </button>

      <p>{dislikesCount}</p>
    </div>
  );
}
