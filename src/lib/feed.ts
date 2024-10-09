import { Channel } from "@/models/channel";
import { ChannelConfig } from "@/types/feed";

export const channelConfigs: ChannelConfig = {
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
  [Channel.Meme]: {
    name: "created-meme",
    color: "text-green",
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
