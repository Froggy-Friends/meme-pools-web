"use client";
import useCastVote from "@/hooks/useCastVote";
import useUser from "@/hooks/useUser";
import useUserVote from "@/hooks/useUserVote";
import useVotes from "@/hooks/useVotes";
import {
  PiArrowFatUpFill,
  PiArrowFatDownFill,
  PiArrowFatDownLight,
  PiArrowFatUpLight,
} from "react-icons/pi";
import { useAccount } from "wagmi";

type VoteCountProps = {
  tokenId: string;
};
export default function TokenVote({ tokenId }: VoteCountProps) {
  const { votes } = useVotes(tokenId);
  const { address } = useAccount();
  const { currentUser } = useUser(address!);
  const { castVote, isCastingVote } = useCastVote(tokenId, currentUser?.id!);
  const { userVote } = useUserVote(tokenId, currentUser?.id!);
  const voteStatus = userVote?.status;

  const handleVote = (status: "upvote" | "downvote" | null) => {
    castVote(voteStatus === status ? null : status);
  };

  return (
    <div className="flex gap-2">
      <button onClick={() => handleVote("upvote")} disabled={isCastingVote}>
        {voteStatus === "upvote" ? <PiArrowFatUpFill /> : <PiArrowFatUpLight />}
        {votes?.upvotes ?? 0}
      </button>
      <button onClick={() => handleVote("downvote")} disabled={isCastingVote}>
        {voteStatus === "downvote" ? (
          <PiArrowFatDownFill />
        ) : (
          <PiArrowFatDownLight />
        )}
        {votes?.downvotes ?? 0}
      </button>
    </div>
  );
}
