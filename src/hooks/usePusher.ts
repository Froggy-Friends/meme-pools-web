import { useEffect } from "react";
import Pusher from "pusher-js";
import { Channel } from "@/models/channel";

const usePusher = (
  tokenId: string,
  handleEvent: (event: any) => void,
  channels: Channel[],
) => {
  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_PUSHER_CLUSTER ||
      !process.env.NEXT_PUBLIC_PUSHER_KEY
    ) {
      throw new Error("Missing pusher env variables");
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const subscribedChannels = channels.map(channel => {
      const channelInstance = pusher.subscribe(channel);
      channelInstance.bind(tokenId, handleEvent);
      return channelInstance;
    });

    return () => {
      subscribedChannels.forEach(channelInstance => {
        channelInstance.unbind(tokenId, handleEvent);
        pusher.unsubscribe(channelInstance.name);
      });
    };
  }, [tokenId, handleEvent, channels]);
};

export default usePusher;
