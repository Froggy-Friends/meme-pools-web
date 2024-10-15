import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeaderBoardAndFeedContainer from "@/components/LeaderBoardAndFeedContainer";
import LiveFeed from "@/components/LiveFeed";
import Spotlight from "@/components/Spotlight";
import TokenPageContent from "@/components/TokenPageContent";
import VotingLeaderboard from "@/components/VotingLeaderboard";
import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import { fetchTokens, fetchTopVotesTokens } from "@/queries/token/queries";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function EthHomePage() {
  const queryClient = new QueryClient();
  const topTokens = await fetchTopVotesTokens();

  const defaultTokensQueryKey = ["tokens", TokenFilter.New, 1];

  await queryClient.prefetchQuery({
    queryKey: defaultTokensQueryKey,
    queryFn: async () => fetchTokens(TokenFilter.New, 1),
  });

  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={Chain.Eth} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col gap-6 w-full">
          <LeaderBoardAndFeedContainer topTokens={topTokens} />

          <Spotlight />

          <TokenPageContent chain={Chain.Eth} />
        </div>
      </HydrationBoundary>

      <Footer />
    </main>
  );
}
