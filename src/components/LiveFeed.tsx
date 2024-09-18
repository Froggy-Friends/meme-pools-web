"use client";

import getClientPusher from "@/lib/getClientPusher";
import { getTimeDifference } from "@/lib/getTimeDifference";
import { Channel, ChannelComment } from "@/models/channel";
import { FeedData } from "@/models/feedData";
import { useEffect } from "react";
import { useImmer } from "use-immer";

const channelToAction = {
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
    color: "text-light-green",
  },
  [Channel.CommentLikes]: {
    name: "liked",
    color: "text-light-green",
  },
  [Channel.Upvotes]: {
    name: "upvoted",
    color: "text-light-green",
  },
  [Channel.Downvotes]: {
    name: "downvoted",
    color: "text-red",
  },
};

export default function LiveFeed() {
  const [feedData, setFeedData] = useImmer<any[]>([]);
  useEffect(() => {
    const pusher = getClientPusher();
    const channels = Object.values(Channel);
    const subscribedChannels = channels.map(channelName => pusher.subscribe(channelName));

    const handleEvent = (channel: Channel, _: string, data: any) => {
      if (Object.keys(data).length > 0) {
        setFeedData(draft => {
          draft.unshift({
            channel: channel,
            user: data.user,
            date: data.date,
            value: data.value,
          });
        });
      }
    };

    subscribedChannels.forEach(channel => {
      channel.bind_global((eventName: string, data: ChannelComment) => {
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

  const formatFeedData = (data: any) => {
    const action = channelToAction[data.channel];
    return (
      <div className="text-xs font-proximaSoft">
        <span>{data.user}</span> <span className={action.color}>{action.name}</span> <span>{data.value}</span>
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
      <div>
        {feedData.map((data, index) => (
          <div key={index} className="flex items-center justify-between text-xs font-proximaSoft">
            <div className="w-full">{formatFeedData(data)}</div>
            <span className="text-[8px] block w-max">{getTimeDifference(data.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
