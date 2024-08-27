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
    <section>
      <div className="flex flex-col w-full h-[450px] my-20 p-6 bg-dark-gray rounded-xl overflow-y-auto">
        <div className="flex gap-x-2">
          <ToggleViewButton
            name="Trades"
            tokenAddress={tokenAddress}
            view={view}
          />
          <ToggleViewButton
            name="Comments"
            tokenAddress={tokenAddress}
            view={view}
          />
        </div>
        {view === "comments" && <TokenComments tokenId={tokenId} />}
        {view === "trades" && <TokenTrades />}
      </div>

      {view === "comments" && <CommentForm tokenId={tokenId} />}
    </section>
  );
}
