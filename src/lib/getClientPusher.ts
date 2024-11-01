import Pusher from "pusher-js";

export default function getClientPusher() {
  if (
    !process.env.NEXT_PUBLIC_PUSHER_CLUSTER ||
    !process.env.NEXT_PUBLIC_PUSHER_KEY
  ) {
    throw new Error("Missing Pusher env variables");
  }

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  });

  return pusher;
}
