import { updateVote } from "@/app/token/[tokenAddress]/actions";
import { TokenVoteData, VoteStatus } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UseCastVoteContext = {
  oldVotes: TokenVoteData | undefined;
  oldUserVote: VoteStatus | undefined;
};

export default function useCastVote(tokenId: string, userId: string) {
  const queryClient = useQueryClient();

  const {
    data,
    isPending: isCastingVote,
    mutate: castVote,
  } = useMutation<void, Error, string | null, UseCastVoteContext>({
    mutationKey: ["castVote", tokenId],
    mutationFn: async (status) => 
      updateVote(tokenId, userId, status),
    onMutate: async (status) => {
      const oldVotes: TokenVoteData | undefined = await queryClient.getQueryData(["votes", tokenId]);
      const oldUserVote: VoteStatus | undefined = await queryClient.getQueryData(["userVote", tokenId]);

      const optimisticData = {
        upvotes: oldVotes?.upvotes ?? 0,
        downvotes: oldVotes?.downvotes ?? 0,
      }

      if(status === "upvote") {
        optimisticData.upvotes++;
        if(oldUserVote === "downvote") optimisticData.downvotes--;
      } else if(status === "downvote") {
        optimisticData.downvotes++;
        if(oldUserVote === "upvote") optimisticData.upvotes--;
      } else if(status === null) {
        if(oldUserVote === "upvote") optimisticData.upvotes--;
        if(oldUserVote === "downvote") optimisticData.downvotes--;
      }
      
      queryClient.setQueryData(["votes", tokenId], optimisticData);
      queryClient.setQueryData(["userVote", tokenId], status);
      
      return { oldVotes, oldUserVote }
    },

    onError: async (error, variables, context) => {
      queryClient.setQueryData(["votes", tokenId], context?.oldVotes);
      queryClient.setQueryData(["userVote", tokenId], context?.oldUserVote);
    },

    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["votes", tokenId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["userVote", tokenId],
      });
    },
  });

  return {
    data,
    isCastingVote,
    castVote,
  };
}
