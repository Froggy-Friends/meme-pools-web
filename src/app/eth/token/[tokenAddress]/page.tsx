import { wethAddress } from "@/config/eth/token";
import getEthPrice from "@/lib/getEthPrice";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import BondingCurveProgress from "../../../../components/token/BondingCurveProgress";
import CommentsAndTradesContainer from "../../../../components/token/CommentsAndTradesContainer";
import VotingProgress from "@/components/token/VotingProgress";
import TokenInfo from "../../../../components/token/TokenInfo";
import Swap from "../../../../components/swap/Swap";
import { fetchTokenByAddress } from "../../../../queries/token/queries";
import { SearchParams } from "@/lib/types";
import { CommentAndTradesView, CommentAndTradesViews } from "@/models/comment";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchUser, fetchUserById } from "@/queries/profile/queries";
import { Chain } from "@/models/chain";
import { cookies } from "next/headers";
import { Cookie } from "@/models/cookie";
import TokenActions from "@/components/token/TokenActions";

const DynamicTokenChart = dynamic(() => import("../../../../components/token/TokenChart"), {
  ssr: false,
});

type TokenDetailsPageProps = {
  params: {
    tokenAddress: string;
  };
  searchParams: SearchParams;
};

export default async function TokenDetailsPage({ params, searchParams }: TokenDetailsPageProps) {
  const view = (searchParams.view as CommentAndTradesView) || CommentAndTradesViews.COMMENTS;
  const tokenAddress = params.tokenAddress;
  const token = await fetchTokenByAddress(tokenAddress);

  if (!token) {
    redirect("/");
  }

  const ethPrice = await getEthPrice(wethAddress);
  const creator = await fetchUserById(token.userId);
  const cookieStore = cookies();
  const cachedUserEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const cachedUser = await fetchUser(cachedUserEvmAddress?.value);

  return (
    <main className="flex flex-col max-w-[1200px] min-h-[100vh] px-4 mx-auto">
      <Header chain={Chain.Eth} />

      <TokenInfo token={token} creator={creator} cachedUser={cachedUser || null} />

      <div className="flex gap-x-10 w-full">
        <div className="flex-[3] flex flex-col">
          <TokenActions token={token} cachedUser={cachedUser || null} />
          <DynamicTokenChart token={token} />
        </div>

        <div className="flex-1 flex flex-col">
          <Swap token={token} currPrice={2} ethPrice={ethPrice} />

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
