import { Channel } from "@/models/channel";

export type ChannelConfig = Record<Channel, { name: string; color: string }>;
