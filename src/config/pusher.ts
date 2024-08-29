import Pusher from "pusher";

if (!process.env.PUSHER_APP_ID) {
  throw new Error("Missing env variables");
}

export const getPusher = (): Pusher => {
  if (
    !process.env.PUSHER_APP_ID ||
    !process.env.PUSHER_KEY ||
    !process.env.PUSHER_SECRET ||
    !process.env.PUSHER_CLUSTER
  ) {
    throw new Error("Missing env variables");
  }

  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
  });

  return pusher;
};
