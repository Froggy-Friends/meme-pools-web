import dynamic from "next/dynamic";
import BondingCurveProgress from "@/components/token-details/BondingCurveProgress";
import CommentsAndTradesContainer from "@/components/token-details/CommentsAndTradesContainer";
import HolderDistribution from "@/components/token-details/HolderDistribution";
import KingOfTheHillProgress from "@/components/token-details/KingOfTheHillProgress";
import TokenInfo from "@/components/token-details/TokenInfo";
import TokenSocials from "@/components/token-details/TokenSocials";
import TokenSwap from "@/components/token-details/TokenSwap";
const DynamicTokenChart = dynamic(
  () => import("../../../components/token-details/TokenChart"),
  {
    ssr: false,
  }
);

export default async function TokenDetailsPage() {
  return (
    <main className="flex flex-col px-12 mb-20">
      <div className="flex gap-x-10 mt-20">
        <div className="w-[65%] flex flex-col">
          <DynamicTokenChart />
          <CommentsAndTradesContainer />
        </div>

        <div className="flex flex-col">
          <TokenSwap
            tokenName="JORDO"
            ownedAmount={100}
            currPrice={2}
            ethPrice={4000}
          />
          <TokenSocials />
          <TokenInfo />
          <BondingCurveProgress />
          <KingOfTheHillProgress />
          <HolderDistribution />
        </div>
      </div>
    </main>
  );
}
