import useUser from "@/hooks/useUser";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa6";
import { useAccount } from "wagmi";
import { addCommentLike, removeCommentLike } from "../actions";
import toast from "react-hot-toast";
import { CommentWithLikes } from "../types";
import { getUserCommentInteraction } from "@/lib/getUserCommentInteraction";

type LikesButtonProps = {
  likesCount: number;
  commentId: string;
  comment: CommentWithLikes;
};

export default function LikeButton({
  likesCount,
  commentId,
  comment,
}: LikesButtonProps) {
  const { address } = useAccount();
  const { currentUser } = useUser(address!);
  const { userCommentLike, userCommentDislike } = getUserCommentInteraction(
    comment,
    currentUser!
  );

  const handleLike = async () => {
    try {
      if (userCommentLike.length === 0 && userCommentDislike.length > 0) {
        await addCommentLike(
          currentUser?.id!,
          commentId,
          "like",
          userCommentDislike[0].id
        );
      } else if (userCommentLike.length === 0) {
        await addCommentLike(currentUser?.id!, commentId, "like");
      } else {
        await removeCommentLike(userCommentLike[0].id);
      }
    } catch (error) {
      console.log(error);
      userCommentLike.length === 0 && toast.error("Error liking comment");
      userCommentLike.length > 0 && toast.error("Error removing comment like");
    }
  };

  return (
    <div className="flex gap-x-2 items-center">
      <button className="hover:scale-110 active:scale-95 transition">
        {userCommentLike.length === 0 ? (
          <FaRegThumbsUp size={17} onClick={() => handleLike()} />
        ) : (
          <FaThumbsUp size={17} onClick={() => handleLike()} />
        )}
      </button>

      <p>{likesCount}</p>
    </div>
  );
}
