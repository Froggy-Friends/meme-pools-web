import { getVotesByTokenId } from "@/app/token/[tokenAddress]/actions";
import { useQuery } from "@tanstack/react-query";

export default function useVotes(tokenId: string) {
  const { data: votes, isPending: isLoadingVotes } = useQuery({
    queryKey: ["votes", tokenId],
    queryFn: () => getVotesByTokenId(tokenId),
    staleTime: 0
  });

  return { votes, isLoadingVotes };
}
