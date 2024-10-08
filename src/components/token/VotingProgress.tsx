import { TokenWithVoteCount } from "@/types/token/types";
import { Progress } from "@nextui-org/react";

type VotingProgressProps = {
  token: TokenWithVoteCount;
};

export default function VotingProgress({ token }: VotingProgressProps) {
  return (
    <section className="hidden laptop:block mt-6 w-[350px]">
      <Progress
        aria-label="Downloading..."
        size="md"
        value={5}
        classNames={{
          base: "max-w-md",
          track: "drop-shadow-md bg-dark-gray h-4",
          indicator: "bg-light-green",
          label: "tracking-wider font-small text-light-gray",
          value: "text-foreground/60 text-gray",
        }}
        showValueLabel={true}
        className="max-w-md pb-2"
        label="Voting Progress"
      />

      {token && (
        <p className="text-cream pt-4">
          ${token.ticker} has {token._count.TokenVote} votes and need 1,000 more to take third place on the leaderboard.
        </p>
      )}
    </section>
  );
}
