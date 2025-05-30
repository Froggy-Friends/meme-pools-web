import TokenComments from "./TokenComments";
import TokenTrades from "./TokenTrades";
import ToggleViewButton from "./ToggleViewButton";
import { CommentAndTradesView } from "@/models/comment";
import CommentForm from "./CommentForm";
import { fetchComments, fetchTrades } from "@/queries/token/queries";
import { User } from "@prisma/client";
import { formatTradesData } from "@/lib/formatTradesData";
import TokenHolders from "./TokenHolders";
import BubbleMaps from "./BubbleMaps";

type TokenInteractionContainerProps = {
  view: CommentAndTradesView;
  tokenAddress: string;
  tokenId: string;
  tokenTicker: string;
  cachedUser: User | null;
  tokenCreator: string;
};

export default async function TokenInteractionContainer({
  view,
  tokenAddress,
  tokenId,
  tokenTicker,
  cachedUser,
  tokenCreator,
}: TokenInteractionContainerProps) {
  const comments = await fetchComments(tokenId);
  const trades = await fetchTrades(tokenId);
  const formattedTrades = formatTradesData(trades);

  return (
    <section>
      <div className="relative flex flex-col w-full h-[700px] my-20 bg-dark-gray rounded-xl overflow-hidden">
        <div className="sticky top-0 z-10 bg-dark-gray mt-2 laptop:mt-0 p-2 laptop:p-6">
          <div className="flex gap-x-2">
            <ToggleViewButton name="Comments" tokenAddress={tokenAddress} view={view} />
            <ToggleViewButton name="Holders" tokenAddress={tokenAddress} view={view} />
            <ToggleViewButton name="Trades" tokenAddress={tokenAddress} view={view} />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-2 laptop:px-6">
          {view === "holders" && (
            <div className="flex flex-col tablet:flex-row gap-y-2 tablet:gap-x-2">
              <TokenHolders tokenAddress={tokenAddress} tokenId={tokenId} />
              <BubbleMaps />
            </div>
          )}
          {view === "comments" && (
            <TokenComments
              comments={comments}
              cachedUser={cachedUser || null}
              tokenId={tokenId}
              tokenTicker={tokenTicker}
              tokenCreator={tokenCreator}
            />
          )}
          {view === "trades" && (
            <TokenTrades
              trades={formattedTrades}
              tokenId={tokenId}
              tokenAddress={tokenAddress}
              tokenTicker={tokenTicker}
            />
          )}
        </div>
      </div>

      {view === "comments" && <CommentForm tokenId={tokenId} tokenAddress={tokenAddress} tokenTicker={tokenTicker} />}
    </section>
  );
}
