import { Channel } from "@/models/channel";
import { ChannelConfig } from "@/types/feed";

export const channelConfigs: ChannelConfig = {
  [Channel.Follow]: {
    name: "followed",
    color: "text-primary",
  },
  [Channel.Unfollow]: {
    name: "unfollowed",
    color: "text-red",
  },
  [Channel.Comment]: {
    name: "commented",
    color: "text-primary",
  },
  [Channel.CommentLikes]: {
    name: "liked",
    color: "text-primary",
  },
  [Channel.CommentDislikes]: {
    name: "disliked",
    color: "text-rose",
  },
  [Channel.Meme]: {
    name: "created-meme",
    color: "text-primary",
  },
  [Channel.Upvotes]: {
    name: "upvoted",
    color: "text-light-primary",
  },
  [Channel.Downvotes]: {
    name: "downvoted",
    color: "text-rose",
  },
  [Channel.CreateToken]: {
    name: "created",
    color: "text-primary",
  },
  [Channel.Buy]: {
    name: "bought",
    color: "text-green",
  },
  [Channel.Sell]: {
    name: "sold",
    color: "text-rose",
  },
  [Channel.ReadyForLp]: {
    name: "ready-for-lp",
    color: "text-primary",
  },
};
