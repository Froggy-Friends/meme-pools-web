import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TokenCarousel from "@/components/TokenCarousel";
import TokenDisplayCard from "@/components/TokenDisplayCard";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import TokenSearch from "@/components/TokenSearch";
import VotingLeaderboard from "@/components/VotingLeaderboard";
import { Chain } from "@/models/chain";
import { fetchTopVotesTokens } from "@/queries/token/queries";

export default async function BaseHomePage() {
  const tokens = await fetchTopVotesTokens();
  return (
    <main className="flex flex-col min-h-[100vh] mx-32 px-4">
      <Header chain={Chain.Base} />

      <div className="flex flex-col gap-6">
        <div className="h-[400px] rounded-lg bg-dark-gray p-4 flex flex-col gap-6">
          <div className="flex items-center justify-between w-full">
            <span className="font-proximaSoftBold uppercase">Leaderboard</span>
            <VotingLeaderboard tokens={tokens} />
          </div>
          <div className="bg-dark px-2.5 py-10 flex items-center gap-2.5 overflow-x-auto overflow-y-hidden rounded-lg w-full h-[320px]">
            {tokens.map((token) => (
              <TokenDisplayCard
                key={token.id}
                token={token}
                layout="horizontal"
              />
            ))}
          </div>
        </div>

        <TokenSearch />
        <TokenDisplayContainer chain={Chain.Base} />
      </div>

      <Footer />
    </main>
  );
}
