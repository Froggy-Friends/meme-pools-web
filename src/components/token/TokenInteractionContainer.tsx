import TokenComments from "./TokenComments";
import TokenTrades from "./TokenTrades";
import ToggleViewButton from "./ToggleViewButton";
import { CommentAndTradesView } from "@/models/comment";
import CommentForm from "./CommentForm";
import { fetchComments, fetchMemes, fetchTrades } from "@/queries/token/queries";
import { User } from "@prisma/client";
import { formatTradesData } from "@/lib/formatTradesData";
import TokenMemes from "./TokenMemes";
import MemeForm from "./MemeForm";

type TokenInteractionContainerProps = {
  view: CommentAndTradesView;
  tokenAddress: string;
  tokenId: string;
  cachedUser: User | null;
};

export default async function TokenInteractionContainer({
  view,
  tokenAddress,
  tokenId,
  cachedUser,
}: TokenInteractionContainerProps) {
  const comments = await fetchComments(tokenId);
  const trades = await fetchTrades(tokenId);
  const memes = await fetchMemes(tokenId);
  const formattedTrades = formatTradesData(trades);

  return (
    <section>
      <div className="relative flex flex-col w-full h-[450px] my-20 bg-dark-gray rounded-xl overflow-hidden">
        <div className="sticky top-0 z-10 bg-dark-gray mt-2 laptop:mt-0 p-2 laptop:p-6">
          <div className="flex gap-x-2">
            <ToggleViewButton name="Trades" tokenAddress={tokenAddress} view={view} />
            <ToggleViewButton name="Comments" tokenAddress={tokenAddress} view={view} />
            <ToggleViewButton name="Memes" tokenAddress={tokenAddress} view={view} />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto p-2 laptop:px-6">
          {view === "comments" && (
            <TokenComments comments={comments} cachedUser={cachedUser || null} tokenId={tokenId} />
          )}
          {view === "trades" && <TokenTrades trades={formattedTrades} tokenId={tokenId} tokenAddress={tokenAddress} />}
          {view === "memes" && <TokenMemes tokenId={tokenId} memes={memes} />}
        </div>
      </div>

      {view === "comments" && <CommentForm tokenId={tokenId} />}
      {view === "memes" && <MemeForm tokenId={tokenId} />}
    </section>
  );
}
