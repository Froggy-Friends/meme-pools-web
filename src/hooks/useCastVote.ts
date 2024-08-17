import { updateVote } from "@/app/token/[tokenAddress]/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useCastVote(tokenId: string, userId: string) {
  const queryClient = useQueryClient();

  const {
    data,
    isPending: isCastingVote,
    mutate: castVote,
  } = useMutation<void, Error, string | null>({
    mutationKey: ["castVote", tokenId],
    mutationFn: async (status) => 
      updateVote(tokenId, userId, status),
    onMutate: async (status) => {
      const oldVotes: any = await queryClient.getQueryData(["votes", tokenId]);
      const oldUserVote: any = await queryClient.getQueryData(["userVote", tokenId]);

      const optimisticData = {
        upvotes: oldVotes.upvotes,
        downvotes: oldVotes.downvotes,
        total: oldVotes.total
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

    onError: async (error, variables, context: any) => {
      queryClient.setQueryData(["votes", tokenId], context.oldVotes);
      queryClient.setQueryData(["userVote", tokenId], context.oldUserVote);
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
