import TokenComments from "./TokenComments";
import TokenTrades from "./TokenTrades";
import ToggleViewButton from "./ToggleViewButton";
import { CommentAndTradesView } from "@/models/comment";
import CommentForm from "./CommentForm";
import { fetchComments } from "@/queries/token/queries";
import { User } from "@prisma/client";

type CommentsAndTradesContainerProps = {
  view: CommentAndTradesView;
  tokenAddress: string;
  tokenId: string;
  currentUser: User | null;
};

export default async function CommentsAndTradesContainer({
  view,
  tokenAddress,
  tokenId,
  currentUser,
}: CommentsAndTradesContainerProps) {
  const comments = await fetchComments(tokenId);

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
        {view === "comments" && (
          <TokenComments
            comments={comments}
            user={currentUser || null}
            tokenId={tokenId}
          />
        )}
        {view === "trades" && <TokenTrades />}
      </div>

      {view === "comments" && <CommentForm tokenId={tokenId} />}
    </section>
  );
}
