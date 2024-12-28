"use client";

import TokenComment from "./TokenComment";
import { CommentWithLikes } from "@/types/token/types";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";
import { usePostHog } from "posthog-js/react";
import Link from "next/link";

type TokenCommentsProps = {
  comments: CommentWithLikes[];
  cachedUser: User | null;
  tokenId: string;
  tokenTicker: string;
  tokenCreator: string;
};

export default function TokenComments({
  comments,
  cachedUser,
  tokenId,
  tokenTicker,
  tokenCreator,
}: TokenCommentsProps) {
  const queryClient = useQueryClient();
  const [tokenComments, setTokenComments] = useState(comments);
  const posthog = usePostHog();

  const { data } = useQuery({
    queryKey: ["token-comments", tokenId],
    initialData: comments,
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(Channel.Comment);

    channel.bind(tokenId, ({ comment }: { comment: CommentWithLikes }) => {
      queryClient.setQueryData(
        ["token-comments", tokenId],
        [...tokenComments, { ...comment, commentLikeCount: 0, commentDislikeCount: 0, isNew: true }]
      );
      setTokenComments(prev => [...prev, { ...comment, commentLikeCount: 0, commentDislikeCount: 0, isNew: true }]);
      posthog.capture("new_comment", { tokenId: tokenId, comment: comment });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [queryClient, tokenComments, tokenId, posthog]);

  return (
    <section className="flex flex-col">
      {!data.length && (
        <p className="ml-1">
          Be the first to{" "}
          <Link href="#post-comment" className="text-primary hover:text-light-primary transition">
            comment
          </Link>{" "}
          on ${tokenTicker}
        </p>
      )}
      {data.map(comment => {
        return (
          <TokenComment
            key={comment.id}
            comment={comment}
            author={comment.user}
            cachedUser={cachedUser || null}
            isNew={comment.isNew}
            tokenCreator={tokenCreator}
          />
        );
      })}
    </section>
  );
}
