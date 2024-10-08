"use client";
import useCastVote from "@/hooks/useCastVote";
import useUser from "@/hooks/useUser";
import useUserVote from "@/hooks/useUserVote";
import useVotes from "@/hooks/useVotes";
import { TokenVoteStatus } from "@/models/token";
import { PiArrowFatUpFill, PiArrowFatDownFill, PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { User } from "@prisma/client";

type VoteCountProps = {
  tokenId: string;
  cachedUser: User | null;
};
export default function TokenVote({ tokenId, cachedUser }: VoteCountProps) {
  const { votes } = useVotes(tokenId);
  const { currentUser } = useUser();
  const { castVote, isCastingVote } = useCastVote(tokenId, cachedUser?.id! || currentUser?.id!);
  const { userVote } = useUserVote(tokenId, cachedUser?.id! || currentUser?.id!);
  const voteStatus = userVote?.status;

  const handleVote = (status: TokenVoteStatus | null) => {
    castVote(voteStatus === status ? null : status);
  };

  return (
    <div className="flex gap-2 w-20">
      <button
        onClick={() => handleVote(TokenVoteStatus.UPVOTE)}
        disabled={isCastingVote}
        className="flex gap-x-1 items-center"
      >
        {voteStatus === TokenVoteStatus.UPVOTE ? (
          <PiArrowFatUpFill className="w-5 h-5 laptop:w-8 laptop:h-8 text-blue hover:scale-[1.03] transition" />
        ) : (
          <PiArrowFatUpLight className="w-5 h-5 laptop:w-8 laptop:h-8 text-blue hover:scale-[1.03] transition" />
        )}
        {votes?.upvotes ?? 0}
      </button>
      <button
        onClick={() => handleVote(TokenVoteStatus.DOWNVOTE)}
        disabled={isCastingVote}
        className="flex gap-x-1 items-center"
      >
        {voteStatus === TokenVoteStatus.DOWNVOTE ? (
          <PiArrowFatDownFill size={25} className="hover:scale-[1.03] transition" />
        ) : (
          <PiArrowFatDownLight size={25} className="hover:scale-[1.03] transition" />
        )}
        {votes?.downvotes ?? 0}
      </button>
    </div>
  );
}
