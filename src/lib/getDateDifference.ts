import dayjs from "dayjs";

export const getDateDifference = (date: Date | null | undefined) => {
  if (!date) {
    return;
  }
  const dateOne = dayjs();
  const dateTwo = dayjs(date);
  const diff = dateOne.diff(dateTwo);

  if (diff < 1000) {
    return `${dateOne.diff(dateTwo, "seconds")}s`;
  } else if (diff > 1000 && diff < 3600000) {
    return `${dateOne.diff(dateTwo, "minutes")}m`;
  } else if (diff > 3600000 && diff < 86400000) {
    return `${dateOne.diff(dateTwo, "hours")}h`;
  } else {
    return `${dateOne.diff(dateTwo, "days")}d`;
  }
};
