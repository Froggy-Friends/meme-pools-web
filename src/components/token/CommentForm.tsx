"use client";

import { postComment } from "@/actions/token/actions";
import useUser from "@/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentWithLikes } from "@/types/token/types";
import toast from "react-hot-toast";
import { useRef } from "react";
import { cn } from "@nextui-org/react";

type CommentFormProps = {
  tokenId: string;
};

export default function CommentForm({ tokenId }: CommentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { currentUser } = useUser();
  const queryClient = useQueryClient();

  const addComment = useMutation({
    mutationKey: ["add-comment", tokenId],
    mutationFn: async (formData: FormData) => {
      currentUser && postComment(formData, currentUser.id, tokenId);
    },
    onMutate: async (formData: FormData) => {
      const message = formData.get("comment") as string;
      const newComment = {
        message: message,
        author: currentUser?.name,
        tokenId: tokenId,
        createdAt: new Date(Date.now()),
        commentLikes: [],
        commentLikeCount: 0,
        commentDislikeCount: 0,
        user: currentUser,
      };

      const initialComments: CommentWithLikes[] | undefined = await queryClient.getQueryData([
        "token-comments",
        tokenId,
      ]);

      initialComments && queryClient.setQueryData(["token-comments", tokenId], [...initialComments, newComment]);

      return { initialComments };
    },
    onError(error, variables, context) {
      queryClient.setQueryData(["token-comments", tokenId], context?.initialComments);
      toast.error("Error adding comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["token-comments", tokenId] });
    },
  });

  return (
    <form
      action={formData => {
        addComment.mutate(formData);
        formRef.current?.reset();
      }}
      className="w-full desktop:w-[780px] h-72 flex flex-col mb-12 laptop:mb-24 p-3 laptop:p-6 bg-dark-gray rounded-xl"
      ref={formRef}
    >
      <textarea
        placeholder="Post a comment..."
        className="w-full desktop:w-[725px] h-[200px] bg-dark rounded-xl p-4 outline-none focus:ring-2 ring-gray"
        name="comment"
        id="comment"
      />
      <button
        disabled={!currentUser}
        className={cn(
          "bg-primary h-10 w-28 rounded-3xl mt-4 py-1 px-8 text-dark font-allumiBold active:scale-[0.97] self-end hover:bg-light-primary transition",
          {
            "hover:bg-primary": !currentUser,
          }
        )}
      >
        Post
      </button>
    </form>
  );
}
