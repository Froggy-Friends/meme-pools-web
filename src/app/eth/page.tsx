import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LiveFeed from "@/components/LiveFeed";
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
    <main className="flex flex-col min-h-[100vh] max-w-[410px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 laptop:px-4">
      <Header chain={Chain.Eth} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col laptop:flex-row items-center gap-2 desktop:gap-4">
            <div className="w-full rounded-lg bg-dark-gray p-4 flex flex-col gap-6">
              <div className="flex items-center justify-between w-full">
                <span className="hidden laptop:block font-proximaSoftBold uppercase">Leaderboard</span>
                <VotingLeaderboard tokens={topTokens} />
              </div>
            </div>

            <LiveFeed />
          </div>

          <TokenPageContent chain={Chain.Eth} />
        </div>
      </HydrationBoundary>

      <Footer />
    </main>
  );
}
