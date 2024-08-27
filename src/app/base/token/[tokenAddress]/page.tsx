import { baseEthAddr } from "@/config/base/token";
import getEthPrice from "@/lib/getEthPrice";
import { EvmChain } from "@/lib/getTokenPrice";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { getVotesByTokenId } from "../../../../actions/token/actions";
import BondingCurveProgress from "../../../../components/token/BondingCurveProgress";
import CommentsAndTradesContainer from "../../../../components/token/CommentsAndTradesContainer";
import VotingProgress from "@/components/token/VotingProgress";
import TokenInfo from "../../../../components/token/TokenInfo";
import TokenSwap from "../../../../components/token/TokenSwap";
import { fetchTokenByAddress } from "../../../../queries/token/queries";
import { SearchParams } from "@/lib/types";
import { CommentAndTradesView, CommentAndTradesViews } from "@/models/comment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchUserById } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import BackButton from "@/components/BackButton";

const DynamicTokenChart = dynamic(
  () => import("../../../../components/token/TokenChart"),
  {
    ssr: false,
  }
);

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
  const creator = await fetchUserById(token.userId);

  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] px-4 mx-auto">
      <Header chain={Chain.Base} />

      <BackButton />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TokenInfo token={token} creator={creator} />
      </HydrationBoundary>

      <div className="flex gap-x-10">
        <div className="w-[65%] flex flex-col">
          <DynamicTokenChart />
        </div>

        <div className="flex flex-col">
          <TokenSwap
            tokenAddress={token.tokenAddress}
            tokenTicker={token.ticker.toUpperCase()}
            currPrice={2}
            ethPrice={ethPrice}
          />

          <BondingCurveProgress />
          <VotingProgress token={token} />
        </div>
      </div>
      <CommentsAndTradesContainer
        view={view}
        tokenAddress={tokenAddress}
        tokenId={token.id}
      />
      <Footer />
    </main>
  );
}
