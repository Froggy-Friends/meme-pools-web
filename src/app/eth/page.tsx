import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LeaderBoardAndFeedContainer from "@/components/LeaderBoardAndFeedContainer";
import Spotlight from "@/components/Spotlight";
import TokenPageContent from "@/components/TokenPageContent";
import { Chain } from "@/models/chain";

export default async function EthHomePage() {
  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={Chain.Eth} />

      <div className="flex flex-col gap-6 w-full">
        <LeaderBoardAndFeedContainer />

        <Spotlight />

        <TokenPageContent />
      </div>

      <Footer />
    </main>
  );
}
