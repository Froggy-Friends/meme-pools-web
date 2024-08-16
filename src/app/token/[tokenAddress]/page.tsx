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
import { fetchTokenByAddress } from "./queries";
import { fetchUserById } from "@/app/profile/[wallet]/queries";
import TokenVote from "./components/TokenVote";
import { getVotes } from "./actions";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
const DynamicTokenChart = dynamic(() => import("./components/TokenChart"), {
  ssr: false,
});

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

  if (!token) {
    redirect("/");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["votes", token.id],
    queryFn: () => getVotes(token.id),
  });

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
          <TokenSocials token={token} />
          <TokenInfo token={token} />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <TokenVote tokenId={token.id} />
          </HydrationBoundary>
          <BondingCurveProgress />
          <KingOfTheHillProgress />
          <HolderDistribution />
        </div>
      </div>
    </main>
  );
}
