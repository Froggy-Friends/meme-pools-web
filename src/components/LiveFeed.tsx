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
import { channelConfigs } from "@/lib/feed";
import { getUserDisplayName } from "@/lib/getUserDisplayName";

export default function LiveFeed() {
  const [feedData, setFeedData] = useImmer<FeedData[]>([]);
  useEffect(() => {
    const pusher = getClientPusher();
    const channels = Object.values(Channel);
    const subscribedChannels = channels.map(channelName => pusher.subscribe(channelName));

    const handleEvent = (channel: Channel, _: string, feedData: FeedData) => {
      if (feedData) {
        setFeedData(draft => {
          draft.unshift({
            channel: channel,
            user: feedData.user,
            date: feedData.date,
            value: feedData.value,
            amount: feedData.amount || undefined,
          });
        });
      }
    };

    subscribedChannels.forEach(channel => {
      channel.bind_global(
        (
          eventName: string,
          {
            feedData,
          }: {
            feedData: FeedData;
          }
        ) => {
          handleEvent(channel.name as Channel, eventName, feedData);
        }
      );
    });

    return () => {
      subscribedChannels.forEach(channel => {
        channel.unbind_all();
        channel.unsubscribe();
      });
      pusher.disconnect();
    };
  }, [setFeedData]);

  const formatFeedData = (data: FeedData) => {
    const action = channelConfigs[data.channel];
    const isCommentVoteChannel = data.channel === Channel.CommentLikes || data.channel === Channel.CommentDislikes;
    const isCommentChannel = data.channel === Channel.Comment || isCommentVoteChannel;
    const isTradeChannel = data.channel === Channel.Buy || data.channel === Channel.Sell;

    return (
      <div className="text-xs font-proximaSoft flex items-center gap-1">
        <Image
          src={data.user.imageUrl || defaultProfileAvatarUrl}
          alt="user-profile-picture"
          height={16}
          width={16}
          className="rounded-full mr-2"
        />
        <span>{getUserDisplayName(data.user.name)}</span> <span className={action.color}>{action.name}</span>
        {isCommentVoteChannel && "comment"}
        {isTradeChannel && <span className="text-cream">{data.amount}</span>}
        <span className="text-light-green">{isCommentChannel ? `"${data.value}"` : data.value}</span>
      </div>
    );
  };

  return (
    <div className="min-w-[350px] w-[350px] h-[400px] rounded-lg bg-dark-gray p-4 flex flex-col gap-6 font-proximaSoftBold">
      <div className="flex items-center justify-between w-full">
        <span>Live Feed</span>
        <span className="text-[8px] flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green animate-pulse"></div> Live
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
