"use client";

import TokenComments from "./TokenComments";
import TokenTrades from "./TokenTrades";
import ToggleViewButton from "./ToggleViewButton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
} from "@nextui-org/react";
import { FaPencil } from "react-icons/fa6";
import FormSubmitButton from "@/components/FormSubmitButton";
import { postComment } from "../actions";
import useUser from "@/hooks/useUser";
import { useAccount } from "wagmi";
import { CommentWithLikes } from "../types";

type CommentsAndTradesContainerProps = {
  view: string;
  tokenAddress: string;
  tokenId: string;
  comments: CommentWithLikes[];
};

export default function CommentsAndTradesContainer({
  view,
  tokenAddress,
  tokenId,
  comments,
}: CommentsAndTradesContainerProps) {
  const { address } = useAccount();
  const { currentUser } = useUser(address!);

  return (
    <div className="flex flex-col">
      <div className="flex gap-x-2">
        <ToggleViewButton name="Comments" tokenAddress={tokenAddress} />
        <ToggleViewButton name="Trades" tokenAddress={tokenAddress} />
        {view === "comments" && (
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
                  postComment(formData, currentUser?.id!, tokenId);
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
        )}
      </div>
      {view === "comments" && <TokenComments comments={comments} />}
      {view === "trades" && <TokenTrades />}
    </div>
  );
}
