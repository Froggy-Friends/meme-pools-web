import dynamic from "next/dynamic";
import BondingCurveProgress from "@/app/token/[tokenAddress]/components/BondingCurveProgress";
import CommentsAndTradesContainer from "@/app/token/[tokenAddress]/components/CommentsAndTradesContainer";
import HolderDistribution from "@/app/token/[tokenAddress]/components/HolderDistribution";
import KingOfTheHillProgress from "@/app/token/[tokenAddress]/components/KingOfTheHillProgress";
import TokenInfo from "@/app/token/[tokenAddress]/components/TokenInfo";
import TokenSocials from "@/app/token/[tokenAddress]/components/TokenSocials";
import TokenSwap from "@/app/token/[tokenAddress]/components/TokenSwap";
import { fetchTokenByAddress } from "./queries";
import { fetchUserById } from "@/app/profile/[wallet]/queries";

const DynamicTokenChart = dynamic(
  () => import("./components/TokenChart"),
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
