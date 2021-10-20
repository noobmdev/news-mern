import dayjs from "dayjs";

export const timestampToDate = (timestamp) => {
  if (!timestamp) return;
  let unixTime2 = dayjs(timestamp);
  return unixTime2.format("HH:mm DD/MM/YYYY");
};
