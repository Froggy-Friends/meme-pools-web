"use client";

import TokenComment from "./TokenComment";
import { CommentWithLikes } from "@/types/token/types";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Channel } from "@/models/channel";

type TokenCommentsProps = {
  comments: CommentWithLikes[];
  user: User | null;
  tokenId: string;
};

export default function TokenComments({
  comments,
  user,
  tokenId,
}: TokenCommentsProps) {
  const queryClient = useQueryClient();
  const [tokenComments, setTokenComments] = useState(comments);

  const { data } = useQuery({
    queryKey: ["token-comments", tokenId],
    initialData: comments,
  });

  useEffect(() => {
    const pusher = new Pusher("a015e9f0282a4e388fd7", {
      cluster: "us3",
    });
    const channel = pusher.subscribe(Channel.Comment);

    channel.bind(tokenId, (newData: CommentWithLikes) => {
      queryClient.setQueryData(
        ["token-comments", tokenId],
        [
          ...tokenComments,
          { ...newData, commentLikeCount: 0, commentDislikeCount: 0 },
        ]
      );
      setTokenComments((prev) => [
        ...prev,
        { ...newData, commentLikeCount: 0, commentDislikeCount: 0 },
      ]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [queryClient, tokenComments, tokenId]);

  return (
    <section className="flex flex-col mt-4">
      {data.map((comment) => {
        return (
          <TokenComment
            key={comment.id}
            comment={comment}
            user={comment.user}
            currentUser={user || null}
          />
        );
      })}
    </section>
  );
}
