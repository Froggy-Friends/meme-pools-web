"use client";

import { MemeWithUser } from "@/types/token/types";
import React, { useEffect } from "react";
import Pusher from "pusher-js";
import { Channel } from "@/models/channel";
import TokenMeme from "./TokenMeme";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { usePostHog } from "posthog-js/react";

type TokenMemesProps = {
  tokenId: string;
  memes: MemeWithUser[];
};

export default function TokenMemes({ tokenId, memes }: TokenMemesProps) {
  const queryClient = useQueryClient();
  const posthog = usePostHog();

  const { data } = useQuery({
    queryKey: ["token-memes", tokenId],
    initialData: memes,
  });

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PUSHER_CLUSTER || !process.env.NEXT_PUBLIC_PUSHER_KEY) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(Channel.Meme);

    channel.bind(tokenId, (meme: MemeWithUser) => {
      queryClient.setQueryData(["token-memes", tokenId], [...data, { ...meme, isNew: true }]);
      posthog.capture("new_meme", { tokenId: tokenId, meme: meme });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [tokenId, queryClient, data, posthog]);

  return (
    <section className="flex flex-col">
      {data.map(meme => {
        return <TokenMeme key={meme.id} meme={meme} />;
      })}
    </section>
  );
}
