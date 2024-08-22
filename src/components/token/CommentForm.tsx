"use client";

import { postComment } from "@/actions/token/actions";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
} from "@nextui-org/react";
import { FaPencil } from "react-icons/fa6";
import FormSubmitButton from "../FormSubmitButton";
import useUser from "@/hooks/useUser";

type CommentFormProps = {
  tokenId: string;
};

export default function CommentForm({
  tokenId,
}: CommentFormProps) {
  const { currentUser } = useUser();
  
  return (
    <Popover placement="bottom" showArrow offset={10}>
      <PopoverTrigger>
        <button className="flex items-center gap-x-2 bg-gray-950/90 rounded-lg p-2 text-white hover:bg-gray-950/80">
          Post comment
          <FaPencil size={17} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <form
          action={(formData) => {
            currentUser && postComment(formData, currentUser.id, tokenId);
          }}
          className="w-full flex flex-col p-1"
        >
          <Textarea
            placeholder="Enter your comment..."
            className="max-w-lg"
            name="comment"
            variant="flat"
          />
          <FormSubmitButton className="bg-gray-950/90 h-10 rounded-lg mt-2 py-2 px-5 text-white active:scale-[0.97] self-end hover:bg-gray-950/80">
            <p>Post</p>
          </FormSubmitButton>
        </form>
      </PopoverContent>
    </Popover>
  );
}
