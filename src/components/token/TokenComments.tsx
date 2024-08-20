import { CommentWithLikes } from "../../types/token/types";
import TokenComment from "./TokenComment";

type TokenCommentsProps = {
  comments: CommentWithLikes[];
};

export default function TokenComments({ comments }: TokenCommentsProps) {
  return (
    <section className="flex flex-col mt-4">
      {comments.map((comment) => {
        return (
          <TokenComment
            key={comment.id}
            comment={comment}
            user={comment.user}
          />
        );
      })}
    </section>
  );
}
