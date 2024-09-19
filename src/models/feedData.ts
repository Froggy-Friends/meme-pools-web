import { User } from "@prisma/client";
import { Channel } from "./channel";

export type FeedData = {
  channel: Channel;
  user: User;
  date: string;
  value: string;
};
