import { fetchUserById } from "@/app/profile/[wallet]/queries";
import { baseEthAddr } from "@/config/token";
import getEthPrice from "@/lib/getEthPrice";
import { EvmChain } from "@/lib/getTokenPrice";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getVotesByTokenId } from "./actions";
import BondingCurveProgress from "./components/BondingCurveProgress";
import CommentsAndTradesContainer from "./components/CommentsAndTradesContainer";
import HolderDistribution from "./components/HolderDistribution";
import KingOfTheHillProgress from "./components/KingOfTheHillProgress";
import TokenInfo from "./components/TokenInfo";
import TokenSocials from "./components/TokenSocials";
import TokenSwap from "./components/TokenSwap";
import TokenVote from "./components/TokenVote";
import { fetchComments, fetchTokenByAddress } from "./queries";
import { SearchParams } from "@/lib/types";
import { CommentAndTradesView, CommentAndTradesViews } from "@/models/comment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  const view =
    (searchParams.view as CommentAndTradesView) ||
    CommentAndTradesViews.COMMENTS;
  const tokenAddress = params.tokenAddress;
  const token = await fetchTokenByAddress(tokenAddress);

  if (!token) {
    redirect("/");
  }

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["votes", token.id],
    queryFn: () => getVotesByTokenId(token.id),
  });

  const ethPrice = await getEthPrice(baseEthAddr, EvmChain.mainnet);
  const creator = await fetchUserById(token.userId!);
  const comments = await fetchComments(token.id);

  return (
    <main className="flex flex-col px-12 mb-20">
      <Header />

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

      <Footer />
    </main>
  );
}
