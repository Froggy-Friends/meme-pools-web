import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "./useUser";
import { addCommentLike, removeCommentLike } from "@/actions/token/actions";
import { CommentWithLikes } from "@/types/token/types";
import { CommentLikes } from "@prisma/client";
import toast from "react-hot-toast";

export default function useCommentLike(
  comment: CommentWithLikes,
  userCommentLike: CommentLikes[],
  userCommentDislike: CommentLikes[],
  dislikesCount: number,
  likesCount: number
) {
  const { currentUser } = useUser();
  const queryClient = useQueryClient();

  const dislikes = useQuery({
    queryKey: ["commentDislikesCount", comment.id],
    initialData: dislikesCount,
  });

  const likes = useQuery({
    queryKey: ["commentLikesCount", comment.id],
    initialData: likesCount,
  });

  const commentLike = useQuery({
    queryKey: ["userCommentLike", comment.id],
    initialData: userCommentLike,
  });

  const commentDisLike = useQuery({
    queryKey: ["userCommentDislike", comment.id],
    initialData: userCommentDislike,
  });

  const newDislike = {
    id: 1,
    userId: currentUser?.id,
    commentId: comment.id,
    status: "dislike",
    createdAt: new Date(Date.now()),
  };

  const newLike = {
    id: 1,
    userId: currentUser?.id,
    commentId: comment.id,
    status: "like",
    createdAt: new Date(Date.now()),
  };

  const handleDislike = useMutation({
    mutationKey: ["dislikeComment", comment.id],
    mutationFn: async () => {
      if (commentDisLike.data.length === 0 && commentLike.data.length > 0) {
        currentUser &&
          (await addCommentLike(
            currentUser.id,
            comment.id,
            "dislike",
            userCommentLike[0].id
          ));
      } else if (commentDisLike.data.length === 0) {
        currentUser &&
          (await addCommentLike(currentUser.id, comment.id, "dislike"));
      } else {
        await removeCommentLike(userCommentDislike[0].id);
      }
    },
    onMutate: async () => {
      const initialLikesCount: number | undefined =
        await queryClient.getQueryData(["commentLikesCount", comment.id]);

      const initialDislikesCount: number | undefined =
        await queryClient.getQueryData(["commentDislikesCount", comment.id]);

      const initialLikeData = await queryClient.getQueryData([
        "userCommentLike",
        comment.id,
      ]);
      const initialDislikeData = await queryClient.getQueryData([
        "userCommentDislike",
        comment.id,
      ]);

      if (commentDisLike.data.length === 0 && commentLike.data.length > 0) {
        queryClient.setQueryData(
          ["commentDislikesCount", comment.id],
          initialDislikesCount === undefined ? 1 : initialDislikesCount + 1
        );
        queryClient.setQueryData(
          ["commentLikesCount", comment.id],
          initialLikesCount === undefined ? 0 : initialLikesCount - 1
        );
        queryClient.setQueryData(["userCommentLike", comment.id], []);
        queryClient.setQueryData(
          ["userCommentDislike", comment.id],
          [newDislike]
        );
      } else if (commentDisLike.data.length === 0) {
        queryClient.setQueryData(
          ["commentDislikesCount", comment.id],
          initialDislikesCount === undefined ? 1 : initialDislikesCount + 1
        );
        queryClient.setQueryData(
          ["userCommentDislike", comment.id],
          [newDislike]
        );
      } else {
        queryClient.setQueryData(
          ["commentDislikesCount", comment.id],
          initialDislikesCount === undefined ? 0 : initialDislikesCount - 1
        );
        queryClient.setQueryData(["userCommentDislike", comment.id], []);
      }

      return { initialLikesCount, initialDislikesCount, initialLikeData, initialDislikeData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        ["commentLikesCount", comment.id],
        context?.initialLikesCount
      );
      queryClient.setQueryData(
        ["commentDislikesCount", comment.id],
        context?.initialDislikesCount
      );
      queryClient.setQueryData(
        ["userCommentLike", comment.id],
        context?.initialLikeData
      );
      queryClient.setQueryData(
        ["userCommentDislike", comment.id],
        context?.initialDislikeData
      );
      toast.error("Error dislike failed");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["commentDislikesCount", comment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userCommentLike", comment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userCommentDislike", comment.id],
      });
    },
  });

  const handleLike = useMutation({
    mutationKey: ["likeComment", comment.id],
    mutationFn: async () => {
      if (commentLike.data.length === 0 && commentDisLike.data.length > 0) {
        currentUser &&
          (await addCommentLike(
            currentUser.id,
            comment.id,
            "like",
            userCommentDislike[0].id
          ));
      } else if (commentLike.data.length === 0) {
        currentUser &&
          (await addCommentLike(currentUser.id, comment.id, "like"));
      } else {
        await removeCommentLike(userCommentLike[0].id);
      }
    },
    onMutate: async () => {
      const initialLikesCount: number | undefined =
        await queryClient.getQueryData(["commentLikesCount", comment.id]);

      const initialDislikesCount: number | undefined =
        await queryClient.getQueryData(["commentDislikesCount", comment.id]);

      const initialLikeData = await queryClient.getQueryData([
        "userCommentLike",
        comment.id,
      ]);
      const initialDislikeData = await queryClient.getQueryData([
        "userCommentDislike",
        comment.id,
      ]);

      if (commentLike.data.length === 0 && commentDisLike.data.length > 0) {
        queryClient.setQueryData(
          ["commentLikesCount", comment.id],
          initialLikesCount === undefined ? 1 : initialLikesCount + 1
        );
        queryClient.setQueryData(
          ["commentDislikesCount", comment.id],
          initialDislikesCount === undefined ? 0 : initialDislikesCount - 1
        );
        queryClient.setQueryData(["userCommentLike", comment.id], [newLike]);
        queryClient.setQueryData(["userCommentDislike", comment.id], []);
      } else if (commentLike.data.length === 0) {
        queryClient.setQueryData(
          ["commentLikesCount", comment.id],
          initialLikesCount === undefined ? 1 : initialLikesCount + 1
        );
        queryClient.setQueryData(["userCommentLike", comment.id], [newDislike]);
      } else {
        queryClient.setQueryData(
          ["commentLikesCount", comment.id],
          initialLikesCount === undefined ? 0 : initialLikesCount - 1
        );
        queryClient.setQueryData(["userCommentLike", comment.id], []);
      }

      return { initialLikesCount, initialDislikesCount, initialLikeData, initialDislikeData };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(
        ["commentLikesCount", comment.id],
        context?.initialLikesCount
      );
      queryClient.setQueryData(
        ["commentDislikesCount", comment.id],
        context?.initialDislikesCount
      );
      queryClient.setQueryData(
        ["userCommentLike", comment.id],
        context?.initialLikeData
      );
      queryClient.setQueryData(
        ["userCommentDislike", comment.id],
        context?.initialDislikeData
      );
      toast.error("Error like failed");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["commentLikesCount", comment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userCommentLike", comment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["userCommentDislike", comment.id],
      });
    },
  });

  return {
    dislikes,
    likes,
    commentDisLike,
    commentLike,
    handleDislike,
    handleLike,
  };
}
