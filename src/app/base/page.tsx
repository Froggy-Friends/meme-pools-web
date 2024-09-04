import LaunchCoinButton from "@/components/LaunchCoinButton";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";
import VotingLeaderboard from "@/components/VotingLeaderboard";
import NewsContainer from "@/components/NewsContainer";
import TokenSearch from "@/components/TokenSearch";

export default function BaseHomePage() {
  return (
    <main className="flex flex-col min-h-[100vh] mx-32 px-4">
      <Header chain={Chain.Base} />

      <div className="flex flex-col gap-6">
        <div className="flex justify-between">
          <NewsContainer />
          <VotingLeaderboard />
        </div>

        <TokenSearch />
        <TokenDisplayContainer chain={Chain.Base} />
      </div>

      <Footer />
    </main>
  );
}
