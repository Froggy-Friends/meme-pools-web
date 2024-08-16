"use client";
import useCastVote from "@/hooks/useCastVote";
import useUser from "@/hooks/useUser";
import { LuThumbsUp, LuThumbsDown } from "react-icons/lu";
import { useAccount } from "wagmi";
import useUserVote from "@/hooks/useUserVote";
import useVotes from "@/hooks/useVotes";

type VoteCountProps = {
  tokenId: string;
};
export default function TokenVote({ tokenId }: VoteCountProps) {
  const { castVote, isCastingVote } = useCastVote(tokenId);
  const { votes } = useVotes(tokenId);
  const { address } = useAccount();
  const { currentUser } = useUser(address!);
  const { userVote } = useUserVote(tokenId, currentUser?.id!);

  const handleVote = (status: "upvote" | "downvote" | null) => {
    castVote(userVote === status ? null : status);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleVote("upvote")} disabled={isCastingVote}>
        <LuThumbsUp
          className={`${userVote === "upvote" ? "fill-black" : ""} ${
            isCastingVote ? "opacity-50" : ""
          }`}
        />
        {votes?.upvotes ?? 0}
      </button>
      <button onClick={() => handleVote("downvote")} disabled={isCastingVote}>
        <LuThumbsDown className={userVote === "upvote" ? "text-black" : ""} />
        {votes?.downvotes ?? 0}
      </button>
    </div>
  );
}
