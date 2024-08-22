import TokenComments from "./TokenComments";
import TokenTrades from "./TokenTrades";
import ToggleViewButton from "./ToggleViewButton";
import { CommentAndTradesView } from "@/models/comment";
import CommentForm from "./CommentForm";

type CommentsAndTradesContainerProps = {
  view: CommentAndTradesView;
  tokenAddress: string;
  tokenId: string;
};

export default function CommentsAndTradesContainer({
  view,
  tokenAddress,
  tokenId,
}: CommentsAndTradesContainerProps) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-x-2">
        <ToggleViewButton name="Comments" tokenAddress={tokenAddress} />
        <ToggleViewButton name="Trades" tokenAddress={tokenAddress} />
        {view === "comments" && <CommentForm tokenId={tokenId} />}
      </div>
      {view === "comments" && <TokenComments tokenId={tokenId} />}
      {view === "trades" && <TokenTrades />}
    </div>
  );
}
