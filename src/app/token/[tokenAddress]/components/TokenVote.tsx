"use client";
import useCastVote from "@/hooks/useCastVote";
import useUser from "@/hooks/useUser";
import useUserVote from "@/hooks/useUserVote";
import useVotes from "@/hooks/useVotes";
import { TokenVoteStatus } from "@/models/token";
import {
  PiArrowFatUpFill,
  PiArrowFatDownFill,
  PiArrowFatDownLight,
  PiArrowFatUpLight,
} from "react-icons/pi";

type VoteCountProps = {
  tokenId: string;
};
export default function TokenVote({ tokenId }: VoteCountProps) {
  const { votes } = useVotes(tokenId);
  const { currentUser } = useUser();
  const { castVote, isCastingVote } = useCastVote(tokenId, currentUser?.id!);
  const { userVote } = useUserVote(tokenId, currentUser?.id!);
  const voteStatus = userVote?.status;

  const handleVote = (status: TokenVoteStatus | null) => {
    castVote(voteStatus === status ? null : status);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleVote(TokenVoteStatus.UPVOTE)}
        disabled={isCastingVote}
      >
        {voteStatus === TokenVoteStatus.UPVOTE ? (
          <PiArrowFatUpFill />
        ) : (
          <PiArrowFatUpLight />
        )}
        {votes?.upvotes ?? 0}
      </button>
      <button
        onClick={() => handleVote(TokenVoteStatus.DOWNVOTE)}
        disabled={isCastingVote}
      >
        {voteStatus === TokenVoteStatus.DOWNVOTE ? (
          <PiArrowFatDownFill />
        ) : (
          <PiArrowFatDownLight />
        )}
        {votes?.downvotes ?? 0}
      </button>
    </div>
  );
}
