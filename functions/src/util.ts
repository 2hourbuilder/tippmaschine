import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import * as utc from "dayjs/plugin/utc";
import * as timezone from "dayjs/plugin/timezone";
import { firestore } from "firebase-admin";
import { Season } from "../../models/season";
import { Match } from "../../models/match";
import { Team } from "../../models/team";
import { Competition, MatchDay } from "../../models/competition";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const parseKicktippDate = (dateString: string) => {
  return dayjs.tz(dateString, "DD.MM.YY HH:mm", "Europe/Berlin").toDate();
};

const converter = <T>() => ({
  toFirestore: (data: T) => data,
  fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) =>
    snap.data() as T,
});

const dataPoint = <T>(collectionPath: string) =>
  firestore().collection(collectionPath).withConverter(converter<T>());

const db = () => {
  return {
    seasons: dataPoint<Season>("seasons"),
    matches: (seasonId: string) =>
      dataPoint<Match>(`seasons/${seasonId}/matches`),
    teams: dataPoint<Team>("teams"),
    competitions: dataPoint<Competition>("competitions"),
    matchdays: (competitionId: string) =>
      dataPoint<MatchDay>(`competitions/${competitionId}/matchdays`),
  };
};
export { db };
