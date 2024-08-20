import { getVotesByTokenId } from "@/actions/token/actions";
import { TokenVoteData } from "@/models/token";

import { useQuery } from "@tanstack/react-query";

export default function useVotes(tokenId: string) {
  const { data: votes, isPending: isLoadingVotes } = useQuery<TokenVoteData>({
    queryKey: ["votes", tokenId],
    queryFn: () => getVotesByTokenId(tokenId),
    staleTime: 0,
  });

  return { votes, isLoadingVotes };
}
