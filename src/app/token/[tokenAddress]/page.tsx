import dynamic from "next/dynamic";
import BondingCurveProgress from "@/components/token-details/BondingCurveProgress";
import CommentsAndTradesContainer from "@/components/token-details/CommentsAndTradesContainer";
import HolderDistribution from "@/components/token-details/HolderDistribution";
import KingOfTheHillProgress from "@/components/token-details/KingOfTheHillProgress";
import TokenInfo from "@/components/token-details/TokenInfo";
import TokenSocials from "@/components/token-details/TokenSocials";
import TokenSwap from "@/components/token-details/TokenSwap";
import getEthPrice from "@/lib/getEthPrice";
import { BASE_ETH_ADDR } from "@/config/token";
import { EvmChain } from "@/lib/getTokenPrice";
import { fetchTokenByAddress, fetchUserById } from "@/lib/actions";
import { redirect } from "next/navigation";
const DynamicTokenChart = dynamic(
  () => import("./components/TokenChart"),
  {
    ssr: false,
  }
);

type TokenDetailsPageProps = {
  tokenAddress: string;
};

export default async function TokenDetailsPage({
  tokenAddress,
}: TokenDetailsPageProps) {
  const token = await fetchTokenByAddress(tokenAddress);

  if (!token) {
    redirect("/");
  }

  const ethPrice = await getEthPrice(BASE_ETH_ADDR, EvmChain.mainnet);
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
            tokenAddress={token.tokenAddress}
            tokenTicker={token.ticker.toUpperCase()}
            currPrice={2}
            ethPrice={ethPrice}
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
