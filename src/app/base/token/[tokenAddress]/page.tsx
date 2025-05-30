import getEthPrice from "@/lib/getEthPrice";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import BondingCurveProgress from "../../../../components/token/BondingCurveProgress";
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
import TokenInteractionContainer from "../../../../components/token/TokenInteractionContainer";
import LiquidityPoolBanner from "@/components/token/LiquidityPoolBanner";

const DynamicTokenChart = dynamic(() => import("../../../../components/token/TokenChart"), {
  ssr: false,
});

type TokenDetailsPageProps = {
  params: {
    tokenAddress: string;
  };
  searchParams: SearchParams;
};

export default async function BaseTokenDetailsPage({ params, searchParams }: TokenDetailsPageProps) {
  const view = (searchParams.view as CommentAndTradesView) || CommentAndTradesViews.COMMENTS;
  const tokenAddress = params.tokenAddress;
  const token = await fetchTokenByAddress(tokenAddress);

  if (!token) {
    redirect("/");
  }

  const ethPrice = await getEthPrice();
  const creator = await fetchUserById(token.userId);
  const cookieStore = cookies();
  const cachedUserEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const cachedUser = await fetchUser(cachedUserEvmAddress?.value);

  return (
    <main className="flex flex-col min-h-[100vh] max-w-[410px] tablet:max-w-[750px] laptop:max-w-[924px] desktop:max-w-[1200px] mx-auto px-2 tablet:px-4">
      <Header chain={Chain.Base} />

      <LiquidityPoolBanner token={token} />

      <TokenInfo token={token} creator={creator} />

      <div className="flex flex-col desktop:flex-row gap-x-10 w-full">
        <div className="flex-[3] flex flex-col mobile-chart">
          <TokenActions token={token} cachedUser={cachedUser || null} />
          <DynamicTokenChart token={token} />
        </div>

        <div className="flex-1 flex flex-col laptop:flex-row desktop:flex-col gap-x-6  mt-[55px] desktop:mt-0 mobile-trade">
          <Swap token={token} ethPrice={ethPrice} />

          <div className="flex flex-col tablet:flex-row laptop:flex-col gap-x-4 mt-12 desktop:mt-0">
            <BondingCurveProgress token={token} />
          </div>
        </div>
      </div>

      <TokenInteractionContainer
        view={view}
        tokenAddress={tokenAddress}
        tokenId={token.id}
        tokenTicker={token.ticker}
        cachedUser={cachedUser || null}
        tokenCreator={token.tokenCreator}
      />
      <Footer />
    </main>
  );
}
