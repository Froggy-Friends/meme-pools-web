import { getUserVote } from "../app/token/[tokenAddress]/actions";
import { useQuery } from "@tanstack/react-query";

export default function useUserVote(tokenId: string, userId: string) {
  const { data: userVote, isPending: isLoadingUserVote } = useQuery({
    queryKey: ["userVote"],
    queryFn: () => getUserVote(tokenId, userId),
  });

  return { userVote, isLoadingUserVote };
}
