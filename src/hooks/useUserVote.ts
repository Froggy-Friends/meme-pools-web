import { VoteStatus } from "@/lib/types";
import { getUserVote } from "../app/token/[tokenAddress]/actions";
import { useQuery } from "@tanstack/react-query";
import { TokenVote } from "@prisma/client";

export default function useUserVote(tokenId: string, userId: string) {
  const { data: userVote, isPending: isLoadingUserVote } =
    useQuery<TokenVote | null>({
      queryKey: ["userVote", tokenId],
      queryFn: () => getUserVote(tokenId, userId),
    });

  return { userVote, isLoadingUserVote };
}
