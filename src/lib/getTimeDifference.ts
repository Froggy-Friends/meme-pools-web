import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const getTimeDifference = (date: Date | null | undefined) => {
  if (!date) {
    return;
  }
  const toDate = dayjs(date);
  return dayjs(toDate).fromNow();
};
