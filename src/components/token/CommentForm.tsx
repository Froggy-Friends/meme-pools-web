"use client";

import { postComment } from "@/actions/token/actions";
import FormSubmitButton from "../FormSubmitButton";
import useUser from "@/hooks/useUser";

type CommentFormProps = {
  tokenId: string;
};

export default function CommentForm({ tokenId }: CommentFormProps) {
  const { currentUser } = useUser();

  return (
    <form
      action={(formData) => {
        currentUser && postComment(formData, currentUser.id, tokenId);
      }}
      className="w-[780px] h-72 flex flex-col mb-20 p-6 bg-dark-gray rounded-xl"
    >
      <textarea
        placeholder="Post a comment..."
        className="w-[725px] h-[200px] bg-dark rounded-xl p-4 outline-none focus:ring-2 ring-gray"
        name="comment"
        id="comment"
      />
      <FormSubmitButton className="bg-green h-10 w-28 rounded-3xl mt-4 py-1 px-8 text-dark font-proximaSoftBold active:scale-[0.97] self-end hover:bg-light-green transition">
        <p>POST</p>
      </FormSubmitButton>
    </form>
  );
}
