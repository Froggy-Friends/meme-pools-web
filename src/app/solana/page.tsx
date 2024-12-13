import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeaderBoardAndFeedContainer from "@/components/LeaderBoardAndFeedContainer";
import Spotlight from "@/components/Spotlight";
import TokenPageContent from "@/components/TokenPageContent";
import { Chain } from "@/models/chain";
import { TokenFilter } from "@/models/token";
import { fetchTokens, fetchTopVotesTokens } from "@/queries/token/queries";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function SolanaHomePage() {
  redirect("/eth");

  const queryClient = new QueryClient();
  const topTokens = await fetchTopVotesTokens(Chain.Solana);

  const defaultTokensQueryKey = ["tokens-solana", TokenFilter.New, 1];

  await queryClient.prefetchQuery({
    queryKey: defaultTokensQueryKey,
    queryFn: async () => fetchTokens(TokenFilter.New, 1, Chain.Solana),
  });

  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={Chain.Solana} />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex flex-col gap-6 w-full">
          <LeaderBoardAndFeedContainer topTokens={topTokens} />

          <Spotlight />

          <TokenPageContent />
        </div>
      </HydrationBoundary>

      <Footer />
    </main>
  );
}
