import TokenComment from "./TokenComment";
import { cookies } from "next/headers";
import { Cookie } from "@/models/cookie";
import { fetchUser } from "@/queries/profile/queries";
import { fetchComments } from "@/queries/token/queries";

type TokenCommentsProps = {
  tokenId: string;
};

export default async function TokenComments({ tokenId }: TokenCommentsProps) {
  const cookieStore = cookies();
  const currentUserEvmAddress = cookieStore.get(Cookie.EvmAddress);
  const currentUser = await fetchUser(currentUserEvmAddress?.value);
  const comments = await fetchComments(tokenId);

  return (
    <section className="flex flex-col mt-4">
      {comments.map((comment) => {
        return (
          <TokenComment
            key={comment.id}
            comment={comment}
            user={comment.user}
            currentUser={currentUser || null}
          />
        );
      })}
    </section>
  );
}
