import { updateVote } from "@/actions/token/actions";
import { TokenVoteData, TokenVoteStatus } from "@/models/token";
import { TokenVote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";
import { usePostHog } from "posthog-js/react";

type UseCastVoteContext = {
  oldVotes: TokenVoteData | undefined;
  oldUserVote: TokenVote | undefined;
};

export default function useCastVote(tokenId: string, userId: string) {
  const queryClient = useQueryClient();
  const posthog = usePostHog();

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER ||
      !process.env.NEXT_PUBLIC_PUSHER_KEY
    ) {
      throw new Error("Missing pusher env variables");
    }
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const upvotesChannel = pusher.subscribe(Channel.Upvotes);
    const downvotesChannel = pusher.subscribe(Channel.Downvotes);

    upvotesChannel.bind(tokenId, (newData: TokenVoteData) => {
      queryClient.setQueryData(["votes", tokenId], newData);

      posthog.capture("token_upvoted", { tokenId: tokenId, vote: newData });
    });

    downvotesChannel.bind(tokenId, (newData: TokenVoteData) => {
      queryClient.setQueryData(["votes", tokenId], newData);

      posthog.capture("token_downvoted", { tokenId: tokenId, vote: newData });
    });

    return () => {
      upvotesChannel.unbind_all();
      upvotesChannel.unsubscribe();

      downvotesChannel.unbind_all();
      downvotesChannel.unsubscribe();

      pusher.disconnect();
    };
  }, [queryClient, tokenId, posthog]);

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
