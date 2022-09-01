import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const parseKicktippDate = (dateString: string) => {
  return dayjs.tz(dateString, "DD.MM.YY HH:mm", "Europe/Berlin").toDate();
};
