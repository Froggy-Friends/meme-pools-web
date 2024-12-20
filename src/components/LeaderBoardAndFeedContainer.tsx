"use client";

import LiveFeed from "./LiveFeed";
import VotingLeaderboard from "./VotingLeaderboard";
import { useFeatureFlagPayload, useFeatureFlagEnabled } from "posthog-js/react";
import { useState, useEffect } from "react";
import { useChain } from "@/context/chain";
import { useQuery } from "@tanstack/react-query";
import { fetchTopVotesTokens } from "@/queries/token/queries";

export default function LeaderBoardAndFeedContainer() {
  const { chain } = useChain();
  const payload = useFeatureFlagPayload(`spotlight-${chain.name}`);
  const isSpotlightEnabled = useFeatureFlagEnabled(`spotlight-${chain.name}`);
  const [isLoading, setIsLoading] = useState(true);

  const { data: tokens } = useQuery({
    queryKey: [`${chain.name}-top-votes-tokens`],
    queryFn: async () => await fetchTopVotesTokens(chain.name),
  });

  useEffect(() => {
    if (payload || !isSpotlightEnabled) {
      setIsLoading(false);
    }
  }, [payload, isSpotlightEnabled]);

  return (
    <div className="mb-[70px] tablet:mb-24  flex flex-col tablet:flex-row items-center gap-2 desktop:gap-4">
      {!payload && !isLoading && (
        <div className="w-full rounded-lg bg-dark-gray p-4 flex flex-col gap-6">
          <div className="flex items-center justify-between w-full">
            <span className="hidden laptop:block font-bold uppercase">Leaderboard</span>
            <VotingLeaderboard tokens={tokens || []} />
          </div>
        </div>
      )}

      {!payload && !isLoading && <LiveFeed />}
    </div>
  );
}
