"use client";

import TokenComment from "./TokenComment";
import { CommentWithLikes } from "@/types/token/types";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Channel } from "@/models/channel";
import Pusher from "pusher-js";

type TokenCommentsProps = {
  comments: CommentWithLikes[];
  cachedUser: User | null;
  tokenId: string;
};

export default function TokenComments({ comments, cachedUser, tokenId }: TokenCommentsProps) {
  const queryClient = useQueryClient();
  const [tokenComments, setTokenComments] = useState(comments);

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
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [queryClient, tokenComments, tokenId]);

  return (
    <section className="flex flex-col">
      {data.map(comment => {
        return (
          <TokenComment key={comment.id} comment={comment} author={comment.user} cachedUser={cachedUser || null} isNew={comment.isNew || false}/>
        );
      })}
    </section>
  );
}
