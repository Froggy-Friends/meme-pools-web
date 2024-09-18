"use client";

import getClientPusher from "@/lib/getClientPusher";
import { getTimeDifference } from "@/lib/getTimeDifference";
import { Channel } from "@/models/channel";
import { FeedData } from "@/models/feedData";
import { useEffect } from "react";
import { useImmer } from "use-immer";
import Image from "next/image";
import { defaultProfileAvatarUrl } from "@/config/user";
import { Virtuoso } from "react-virtuoso";

const channelToAction: Record<Channel, { name: string; color: string }> = {
  [Channel.Follow]: {
    name: "followed",
    color: "text-green",
  },
  [Channel.Unfollow]: {
    name: "unfollowed",
    color: "text-red",
  },
  [Channel.Comment]: {
    name: "commented",
    color: "text-green",
  },
  [Channel.CommentLikes]: {
    name: "liked",
    color: "text-green",
  },
  [Channel.CommentDislikes]: {
    name: "disliked",
    color: "text-rose",
  },
  [Channel.Upvotes]: {
    name: "upvoted",
    color: "text-light-green",
  },
  [Channel.Downvotes]: {
    name: "downvoted",
    color: "text-rose",
  },
  [Channel.CreateToken]: {
    name: "created",
    color: "text-green",
  },
  [Channel.Buy]: {
    name: "bought",
    color: "text-green",
  },
  [Channel.Sell]: {
    name: "sold",
    color: "text-rose",
  },
};

export default function LiveFeed() {
  const [feedData, setFeedData] = useImmer<any[]>([]);
  useEffect(() => {
    const pusher = getClientPusher();
    const channels = Object.values(Channel);
    const subscribedChannels = channels.map(channelName => pusher.subscribe(channelName));

    const handleEvent = (channel: Channel, _: string, { feedData }: any) => {
      if (feedData) {
        setFeedData(draft => {
          draft.unshift({
            channel: channel,
            user: feedData.user,
            date: feedData.date,
            value: feedData.value,
          });
        });
      }
    };

    subscribedChannels.forEach(channel => {
      channel.bind_global((eventName: string, data: any) => {
        handleEvent(channel.name as Channel, eventName, data);
      });
    });

    return () => {
      subscribedChannels.forEach(channel => {
        channel.unbind_all();
        channel.unsubscribe();
      });
      pusher.disconnect();
    };
  }, []);

  const formatFeedData = (data: FeedData) => {
    const action = channelToAction[data.channel];
    const isCommentVoteChannel = data.channel === Channel.CommentLikes || data.channel === Channel.CommentDislikes;
    const isCommentChannel = data.channel === Channel.Comment || isCommentVoteChannel;

    return (
      <div className="text-xs font-proximaSoft flex items-center gap-1">
        <Image
          src={data.user.imageUrl || defaultProfileAvatarUrl}
          alt="user-profile-picture"
          height={16}
          width={16}
          className="rounded-full mr-2"
        />
        <span>{data.user.name}</span> <span className={action.color}>{action.name}</span>
        {isCommentVoteChannel && "comment "}
        <span className="text-light-green">{isCommentChannel ? `"${data.value}"` : data.value}</span>
      </div>
    );
  };

  return (
    <div className="min-w-[350px] w-[350px] h-[400px] rounded-lg bg-dark-gray p-4 flex flex-col gap-6 font-proximaSoftBold">
      <div className="flex items-center justify-between w-full">
        <span>Live Feed</span>
        <span className="text-[8px] flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green"></div> Live
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <Virtuoso
          style={{ height: "400px" }}
          totalCount={feedData.length}
          itemContent={index => (
            <div key={index} className="flex items-center justify-between text-xs font-proximaSoft">
              <div className="w-full truncate line-clamp-1 overflow-hidden">{formatFeedData(feedData[index])}</div>
              <span className="text-[8px] block w-max shrink-0">{getTimeDifference(feedData[index].date)}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
