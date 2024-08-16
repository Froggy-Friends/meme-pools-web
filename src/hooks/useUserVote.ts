import { getUserVoteStatus } from "../app/token/[tokenAddress]/actions";
import { useQuery } from "@tanstack/react-query";

export default function useUserVote(tokenId: string, userId: string) {
  const { data: userVote, isPending: isLoadingUserVote } = useQuery({
    queryKey: ["userVoteStatus"],
    queryFn: () => getUserVoteStatus(tokenId, userId),
  });

  return { userVote, isLoadingUserVote };
}
