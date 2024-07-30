import dynamic from "next/dynamic";
import BondingCurveProgress from "@/components/token-details/BondingCurveProgress";
import CommentsAndTradesContainer from "@/components/token-details/CommentsAndTradesContainer";
import HolderDistribution from "@/components/token-details/HolderDistribution";
import KingOfTheHillProgress from "@/components/token-details/KingOfTheHillProgress";
import TokenInfo from "@/components/token-details/TokenInfo";
import TokenSocials from "@/components/token-details/TokenSocials";
import TokenSwap from "@/components/token-details/TokenSwap";
import { fetchTokenByAddress, fetchUserById } from "@/lib/actions";
const DynamicTokenChart = dynamic(
  () => import("../../../components/token-details/TokenChart"),
  {
    ssr: false,
  }
);

type TokenDetailsPageProps = {
  params: {
    tokenAddress: string;
  };
};

export default async function TokenDetailsPage({
  params,
}: TokenDetailsPageProps) {
  const tokenAddress = params.tokenAddress;
  const token = await fetchTokenByAddress(tokenAddress);
  const creator = await fetchUserById(token?.userId!);

  return (
    <main className="flex flex-col px-12 mb-20">
      <div className="flex gap-x-10 mt-20">
        <div className="w-[65%] flex flex-col">
          <DynamicTokenChart token={token!} creator={creator!} />
          <CommentsAndTradesContainer />
        </div>

        <div className="flex flex-col">
          <TokenSwap
            tokenName={token?.ticker!}
            ownedAmount={100}
            currPrice={2}
            ethPrice={4000}
            tokenAddress={tokenAddress}
          />
          <TokenSocials token={token!} />
          <TokenInfo token={token!} />
          <BondingCurveProgress />
          <KingOfTheHillProgress />
          <HolderDistribution />
        </div>
      </div>
    </main>
  );
}
