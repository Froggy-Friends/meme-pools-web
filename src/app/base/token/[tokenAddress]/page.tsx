import { baseEthAddr } from "@/config/base/token";
import getEthPrice from "@/lib/getEthPrice";
import { EvmChain } from "@/lib/getTokenPrice";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
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
import { fetchUser, fetchUserById } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import BackButton from "@/components/BackButton";
import { cookies } from "next/headers";
import { Cookie } from "@/models/cookie";

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

  const ethPrice = await getEthPrice(baseEthAddr, EvmChain.mainnet);
  const creator = await fetchUserById(token.userId);
  const cookieStore = cookies();
  const cachedUserEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const cachedUser = await fetchUser(cachedUserEvmAddress?.value);

  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] px-4 mx-auto">
      <Header chain={Chain.Base} />

      <BackButton />

      <TokenInfo
        token={token}
        creator={creator}
        cachedUser={cachedUser || null}
      />

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
        cachedUser={cachedUser || null}
      />
      <Footer />
    </main>
  );
}
