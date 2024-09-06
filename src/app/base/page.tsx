import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TokenDisplayCard from "@/components/TokenDisplayCard";
import TokenPageContent from "@/components/TokenPageContent";
import VotingLeaderboard from "@/components/VotingLeaderboard";
import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import { fetchTokens, fetchTopVotesTokens } from "@/queries/token/queries";
import { TokenWithVotes } from "@/types/token/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function BaseHomePage() {
  const queryClient = new QueryClient();

  const defaultTokensQueryKey = ["tokens", TokenFilter.New, 1];

  await queryClient.prefetchQuery({
    queryKey: defaultTokensQueryKey,
    queryFn: () => fetchTokens(TokenFilter.New, 1),
  });

  const tokens: TokenWithVotes[] | undefined = await queryClient.getQueryData(
    defaultTokensQueryKey
  );

  return (
    <main className="flex flex-col min-h-[100vh] mx-32 px-4">
      <Header chain={Chain.Base} />

      <div className="flex flex-col gap-6">
        <div className="h-[400px] rounded-lg bg-dark-gray p-4 flex flex-col gap-6">
          <div className="flex items-center justify-between w-full">
            <span className="font-proximaSoftBold uppercase">Leaderboard</span>
            {tokens && tokens.length > 0 && (
              <VotingLeaderboard tokens={tokens} />
            )}
          </div>
          <div className="bg-dark px-2.5 py-10 flex items-center gap-2.5 overflow-x-auto overflow-y-hidden rounded-lg w-full h-[320px]">
            {tokens?.map((token) => (
              <TokenDisplayCard
                key={token.id}
                token={token}
                layout="horizontal"
              />
            ))}
          </div>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <TokenPageContent chain={Chain.Base} />
        </HydrationBoundary>
      </div>

      <Footer />
    </main>
  );
}
