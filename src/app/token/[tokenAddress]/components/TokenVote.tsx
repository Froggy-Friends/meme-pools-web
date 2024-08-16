"use client";
import useCastVote from "@/hooks/useCastVote";
import useUser from "@/hooks/useUser";
import { LuThumbsUp, LuThumbsDown } from "react-icons/lu";
import { useAccount } from "wagmi";
import useUserVote from "@/hooks/useUserVote";

type VoteCountProps = {
  votes: any;
  tokenId: string;
};
export default function TokenVote({ votes, tokenId }: VoteCountProps) {
  const { castVote } = useCastVote(tokenId);
  const { address } = useAccount();
  const { currentUser } = useUser(address!);
  const { userVote } = useUserVote(tokenId, currentUser?.id!);

  return (
    <div className="flex gap-2">
      <button onClick={() => castVote(userVote === "upvote" ? null : "upvote")}>
        <LuThumbsUp className={userVote === "upvote" ? "fill-black" : ""} />
        {votes.upvotes ?? 0}
      </button>
      <button
        onClick={() => castVote(userVote === "downvote" ? null : "downvote")}
      >
        <LuThumbsDown className={userVote === "upvote" ? "text-black" : ""} />
        {votes.downvotes ?? 0}
      </button>
    </div>
  );
}
