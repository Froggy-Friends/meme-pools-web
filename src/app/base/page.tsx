import LaunchCoinButton from "@/components/LaunchCoinButton";
import TokenDisplayContainer from "@/components/TokenDisplayContainer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Chain } from "@/models/chain";
import VotingLeaderboard from "@/components/VotingLeaderboard";
import NewsContainer from "@/components/NewsContainer";

export default function BaseHomePage() {
  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] mx-auto px-4">
      <Header chain={Chain.Base} />

      <div className="flex justify-between mt-28">
        <NewsContainer />
        <VotingLeaderboard />
        <LaunchCoinButton />
      </div>

      <TokenDisplayContainer chain={Chain.Base} />

      <Footer />
    </main>
  );
}
