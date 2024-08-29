import { useContext } from "react";
import { PusherContext } from "@/providers/PusherProvider";
import Pusher from "pusher-js";

export const usePusher = (): Pusher => {
  const context = useContext(PusherContext);
  if (!context) {
    throw new Error('usePusher must be used within a PusherProvider');
  }
  if (!context.pusher) {
    throw new Error('Pusher instance is not initialized yet.');
  }
  return context.pusher;
};