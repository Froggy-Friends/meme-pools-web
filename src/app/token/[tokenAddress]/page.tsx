import dynamic from "next/dynamic";
import BondingCurveProgress from "./components/BondingCurveProgress";
import CommentsAndTradesContainer from "./components/CommentsAndTradesContainer";
import HolderDistribution from "./components/HolderDistribution";
import KingOfTheHillProgress from "./components/KingOfTheHillProgress";
import TokenInfo from "./components/TokenInfo";
import TokenSocials from "./components/TokenSocials";
import TokenSwap from "./components/TokenSwap";
import getEthPrice from "@/lib/getEthPrice";
import { BASE_ETH_ADDR } from "@/config/token";
import { EvmChain } from "@/lib/getTokenPrice";
import { redirect } from "next/navigation";
import { fetchComments, fetchTokenByAddress } from "./queries";
import { fetchUserById } from "@/app/profile/[wallet]/queries";
import { SearchParams } from "@/lib/types";
const DynamicTokenChart = dynamic(() => import("./components/TokenChart"), {
  ssr: false,
});

type TokenDetailsPageProps = {
  params: {
    tokenAddress: string;
  };
  searchParams: SearchParams;
};

export default async function TokenDetailsPage({
  params,
  searchParams,
}: TokenDetailsPageProps) {
  const view = (searchParams.view as string) || "comments";
  const tokenAddress = params.tokenAddress;
  const token = await fetchTokenByAddress(tokenAddress);

  if (!token) {
    redirect("/");
  }

  const ethPrice = await getEthPrice(BASE_ETH_ADDR, EvmChain.mainnet);
  const creator = await fetchUserById(token.userId!);
  const comments = await fetchComments(token.id);

  return (
    <main className="flex flex-col px-12 mb-20">
      <div className="flex gap-x-10 mt-20">
        <div className="w-[65%] flex flex-col">
          <DynamicTokenChart token={token!} creator={creator!} />
          <CommentsAndTradesContainer
            view={view}
            tokenAddress={tokenAddress}
            tokenId={token.id}
            comments={comments}
          />
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
