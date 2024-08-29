import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUser from "./useUser";
import { addCommentLike, removeCommentLike } from "@/actions/token/actions";
import { CommentLikesWithUser, CommentWithLikes } from "@/types/token/types";
import { CommentLikes, User } from "@prisma/client";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Pusher from "pusher-js";
import { Channel } from "@/models/channel";
import { CommentLikeStatus } from "@/models/comment";

type CommentLikesChannelReturn = {
  add: CommentLikesWithUser;
  remove: CommentLikesWithUser;
};

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

  let newDislike: CommentLikes;

  let newLike: CommentLikes;

  useEffect(() => {
    const pusher = new Pusher('a015e9f0282a4e388fd7', {
      cluster: 'us3',
    });

    const channel = pusher.subscribe(Channel.CommentLikes);

    const updatedLikes = {
      likes: likesCount,
      dislikes: dislikesCount,
    };

    channel.bind(comment.id, async (newData: CommentLikesChannelReturn) => {
      if (newData.add && !newData.remove) {
        if (newData.add.status === CommentLikeStatus.LIKE) {
          updatedLikes.likes++;
          queryClient.setQueryData(
            ["commentLikesCount", comment.id],
            updatedLikes.likes
          );
        } else {
          updatedLikes.dislikes++;
          queryClient.setQueryData(
            ["commentDislikesCount", comment.id],
            updatedLikes.dislikes
          );
        }
      } else if (newData.remove && !newData.add) {
        if (newData.remove.status === CommentLikeStatus.LIKE) {
          updatedLikes.likes--;
          queryClient.setQueryData(
            ["commentLikesCount", comment.id],
            updatedLikes.likes
          );
        } else {
          updatedLikes.dislikes--;
          queryClient.setQueryData(
            ["commentDislikesCount", comment.id],
            updatedLikes.dislikes
          );
        }
      } else if (newData.remove && newData.add) {
        if (newData.add.status === CommentLikeStatus.LIKE) {
          updatedLikes.likes++;
          queryClient.setQueryData(
            ["commentLikesCount", comment.id],
            updatedLikes.likes
          );
          updatedLikes.dislikes--;
          queryClient.setQueryData(
            ["commentDislikesCount", comment.id],
            updatedLikes.dislikes
          );
        } else {
          updatedLikes.likes--;
          queryClient.setQueryData(
            ["commentLikesCount", comment.id],
            updatedLikes.likes
          );
          updatedLikes.dislikes++;
          queryClient.setQueryData(
            ["commentDislikesCount", comment.id],
            updatedLikes.dislikes
          );
        }
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [comment.id, queryClient, likesCount, dislikesCount]);

  const handleDislike = useMutation({
    mutationKey: ["dislikeComment", comment.id],
    mutationFn: async () => {
      if (commentDisLike.data.length === 0 && commentLike.data.length > 0) {
        const result = await addCommentLike(
          currentUser!.id,
          comment.id,
          "dislike",
          commentLike.data[0].id
        );
        newDislike = result;
        queryClient.setQueryData(
          ["userCommentDislike", comment.id],
          [newDislike]
        );
      } else if (commentDisLike.data.length === 0) {
        const result = await addCommentLike(
          currentUser!.id,
          comment.id,
          "dislike"
        );
        newDislike = result;
        queryClient.setQueryData(
          ["userCommentDislike", comment.id],
          [newDislike]
        );
      } else {
        await removeCommentLike(commentDisLike.data[0].id, comment.id);
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

      return {
        initialLikesCount,
        initialDislikesCount,
        initialLikeData,
        initialDislikeData,
      };
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
        const result = await addCommentLike(
          currentUser!.id,
          comment.id,
          "like",
          commentDisLike.data[0].id
        );
        newLike = result;
        queryClient.setQueryData(["userCommentLike", comment.id], [newLike]);
      } else if (commentLike.data.length === 0) {
        const result = await addCommentLike(
          currentUser!.id,
          comment.id,
          "like"
        );
        newLike = result;
        queryClient.setQueryData(["userCommentLike", comment.id], [newLike]);
      } else {
        await removeCommentLike(commentLike.data[0].id, comment.id);
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

      return {
        initialLikesCount,
        initialDislikesCount,
        initialLikeData,
        initialDislikeData,
      };
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
