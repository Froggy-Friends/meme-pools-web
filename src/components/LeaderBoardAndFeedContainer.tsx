"use client";

import { Token } from "@prisma/client";
import LiveFeed from "./LiveFeed";
import VotingLeaderboard from "./VotingLeaderboard";
import { useFeatureFlagPayload, useFeatureFlagEnabled } from "posthog-js/react";
import { useState, useEffect } from "react";

type LeaderBoardAndFeedContainerProps = {
  topTokens: Token[];
};

export default function LeaderBoardAndFeedContainer({ topTokens }: LeaderBoardAndFeedContainerProps) {
  const payload = useFeatureFlagPayload("spotlight");
  const isSpotlightEnabled = useFeatureFlagEnabled("spotlight");
  const [isLoading, setIsLoading] = useState(true);

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
            <span className="hidden laptop:block font-allumiBold uppercase">Leaderboard</span>
            <VotingLeaderboard tokens={topTokens} />
          </div>
        </div>
      )}

      {!payload && !isLoading && <LiveFeed />}
    </div>
  );
}
