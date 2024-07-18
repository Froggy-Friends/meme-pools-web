import Footer from "@/components/Footer";
import Header from "@/components/Header";
import BondingCurveProgress from "@/components/token-details/BondingCurveProgress";
import CommentsAndTradesContainer from "@/components/token-details/CommentsAndTradesContainer";
import HolderDistribution from "@/components/token-details/HolderDistribution";
import KingOfTheHillProgress from "@/components/token-details/KingOfTheHillProgress";
import TokenChart from "@/components/token-details/TokenChart";
import TokenInfo from "@/components/token-details/TokenInfo";
import TokenSocials from "@/components/token-details/TokenSocials";
import TokenSwap from "@/components/token-details/TokenSwap";

export default function TokenDetailsPage() {
  return (
    <main className="flex flex-col px-12">
      <Header />

      <div className="flex gap-x-10 mt-20">
        <div className="w-[65%] flex flex-col">
          <TokenChart />
          <CommentsAndTradesContainer />
        </div>

        <div className="flex flex-col">
          <TokenSwap />
          <TokenSocials />
          <TokenInfo />
          <BondingCurveProgress />
          <KingOfTheHillProgress />
          <HolderDistribution />
        </div>
      </div>

      <Footer />
    </main>
  );
}
