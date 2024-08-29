import { updateVote } from "@/actions/token/actions";
import { TokenVoteData, TokenVoteStatus } from "@/models/token";
import { TokenVote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Channel } from "@/models/channel";
import { usePusher } from "./usePusher";

type UseCastVoteContext = {
  oldVotes: TokenVoteData | undefined;
  oldUserVote: TokenVote | undefined;
};

export default function useCastVote(tokenId: string, userId: string) {
  const queryClient = useQueryClient();
  const pusher = usePusher();

  useEffect(() => {

    const channel = pusher.subscribe(Channel.Votes);

    channel.bind(tokenId, (newData: TokenVoteData) => {
      queryClient.setQueryData(["votes", tokenId], newData);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [queryClient, tokenId]);

  const {
    data,
    isPending: isCastingVote,
    mutate: castVote,
  } = useMutation<void, Error, TokenVoteStatus | null, UseCastVoteContext>({
    mutationKey: ["castVote", tokenId],
    mutationFn: async (status) => updateVote(tokenId, userId, status),
    onMutate: async (status) => {
      const oldVotes: TokenVoteData | undefined =
        await queryClient.getQueryData(["votes", tokenId]);
      const oldUserVote: TokenVote | undefined = await queryClient.getQueryData(
        ["userVote", tokenId]
      );
      const oldVoteStatus = oldUserVote?.status;
      const optimisticData = {
        upvotes: oldVotes?.upvotes ?? 0,
        downvotes: oldVotes?.downvotes ?? 0,
        total: oldVotes?.total ?? 0,
      };

      if (status === TokenVoteStatus.UPVOTE) {
        optimisticData.upvotes++;
        if (oldVoteStatus === TokenVoteStatus.DOWNVOTE)
          optimisticData.downvotes--;
      } else if (status === TokenVoteStatus.DOWNVOTE) {
        optimisticData.downvotes++;
        if (oldVoteStatus === TokenVoteStatus.UPVOTE) optimisticData.upvotes--;
      } else if (status === null) {
        if (oldVoteStatus === TokenVoteStatus.UPVOTE) optimisticData.upvotes--;
        if (oldVoteStatus === TokenVoteStatus.DOWNVOTE)
          optimisticData.downvotes--;
      }

      optimisticData.total = optimisticData.upvotes + optimisticData.downvotes;

      queryClient.setQueryData(["votes", tokenId], optimisticData);
      queryClient.setQueryData(["userVote", tokenId], {
        ...oldUserVote,
        status,
      });

      return { oldVotes, oldUserVote };
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
