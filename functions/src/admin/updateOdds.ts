import { Odds } from "../../../models/match";
import * as dayjs from "dayjs";
import { db } from "../util";
import getOdds from "../kicktipp/getOdds";
import { logger } from "firebase-functions/v1";
import {
  CallableRequest,
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";
import { firestore } from "firebase-admin";
import getOddsAPI from "../api-football/getOdds";
import { UpdateOddsParams } from "../../../functionTypes";

const updateodds = onCall(
  { region: "europe-west1" },
  async (data: CallableRequest<UpdateOddsParams>) => {
    /*
    Purpose:
    - run this function to update odds for matches scheduled between two given days in future
    - get list of matches scheduled between the two dates
    - update odds from API or kicktipp as backup as API only serves odds data <14 days before kick-off

    Logic:
    - get all Seasons with at least this year as startyear
    - for each active season:
      - get all matches in time interval from these seasons
      - for each match:
        - get odds (in parallel)
        - update match docs (bulkwrite)
    */

    const fromDaysInFuture = data.data.fromDaysInFuture;
    const untilDaysInFuture = data.data.untilDaysInFuture;

    const startDate = fromDaysInFuture
      ? dayjs().add(fromDaysInFuture, "day").toDate()
      : new Date();
    const endDate = untilDaysInFuture
      ? dayjs().add(untilDaysInFuture, "day").toDate()
      : dayjs().add(1, "year").toDate();

    const getActiveSeasons = async () => {
      const seasonSnapshots = await db()
        .seasons.where("startYear", ">=", new Date().getFullYear())
        .get();
      const seasons = seasonSnapshots.docs.map((doc) => {
        const season = doc.data();
        season.id = doc.id;
        return season;
      });
      return seasons;
    };

    const getFutureMatches = async (seasonId: string) => {
      const matchData: Array<{
        id: string;
        homeTeam: string;
        matchday: number;
        fixtureId: number;
      }> = [];

      const matchesSnapshot = await db()
        .matches(seasonId)
        .where("kickoff", ">=", startDate)
        .where("kickoff", "<=", endDate)
        .get();

      if (!matchesSnapshot?.empty) {
        matchesSnapshot?.docs.forEach((match) =>
          matchData.push({
            id: match.id,
            homeTeam: match.data().homeTeam.name.de,
            matchday: match.data().matchday,
            fixtureId: match.data().apiFixtureId,
          })
        );
      }
      return matchData;
    };

    const getKicktippOdds = async (
      kurznameAdminSeason: string,
      kicktippSeasonId: string,
      matches: Array<{ id: string; homeTeam: string; matchday: number }>
    ) => {
      const requests = matches.map(async (match) => {
        const odds = await getOdds(
          kurznameAdminSeason,
          kicktippSeasonId,
          match.homeTeam,
          match.matchday,
          "Y2hyaXN0b3BoZXIlNDBzY2hhdW1sb2VmZmVsLmRlOjE2OTQxMTU5NjQ4MjQ6NTQ5M2VmOTNmYTkzNGNmOTdkNzYzZDNiNzRkOTBjOGY"
        );
        return {
          matchId: match.id,
          odds: odds,
        };
      });
      const result = await Promise.all(requests);
      return result;
    };

    const updateMatchDocs = async (
      seasonId: string,
      matches: Array<{ matchId: string; odds: Odds | null }>
    ) => {
      const bulkWriter = firestore().bulkWriter();
      matches.forEach((match) => {
        const docRef = db().matches(seasonId).doc(match.matchId);
        bulkWriter.update(docRef, {
          odds: match.odds,
        });
      });
      bulkWriter.close();
    };

    try {
      const activeSeasons = await getActiveSeasons();
      const result = await Promise.all(
        activeSeasons
          .map(async (season) => {
            if (season.id) {
              const matches = await getFutureMatches(season.id);

              const kicktippOdds = await getKicktippOdds(
                season.kurzname,
                season.seasonId,
                matches
              );
              const matchesWithOdds = await Promise.all(
                matches.map(async (match) => {
                  const APIOdds = await getOddsAPI(match.fixtureId);
                  const kicktippOdd = kicktippOdds.find(
                    (matchOdds) => matchOdds.matchId === match.id
                  );
                  // if (match.matchday === 10) {
                  //   console.log(`Match: ${match.homeTeam} on matchday ${
                  //     match.matchday
                  //   } with fixtureId ${match.fixtureId} has following odds:
                  //    APIOdds: ${
                  //      APIOdds ? "Yes" : "None"
                  //    }, KicktippOdds: ${JSON.stringify(kicktippOdd)}`);
                  // }
                  return {
                    matchId: match.id,
                    odds: APIOdds
                      ? APIOdds
                      : kicktippOdd
                      ? kicktippOdd.odds
                      : null,
                  };
                })
              );
              await updateMatchDocs(season.id, matchesWithOdds);
              return {
                season: season.seasonName,
                matches: matches.length,
                odds: kicktippOdds.length,
              };
            } else {
              return null;
            }
          })
          .filter(
            (
              e
            ): e is Promise<{
              season: { en: string; de: string };
              matches: number;
              odds: number;
            }> => e != null
          )
      );

      return result;
    } catch (error) {
      logger.error("Could not complete function", error);
      throw new HttpsError("internal", "Could not complete function", error);
    }
  }
);

export default updateodds;
