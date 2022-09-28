import { Odds } from "../../../models/match";
import * as dayjs from "dayjs";
import { db } from "../util";
import getOdds from "../kicktipp/getOdds";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import { firestore } from "firebase-admin";

const updateoddsmonthly = async () => {
  /*
    Purpose:
    - run this function monthly at 6 a.m. Berlin time on 1st day of months to update odds for matches scheduled in > 30 time
    - get list of matches scheduled in >30 days
    - update odds from kicktipp as API only serves odds data <14 days before kick-off

    Logic:
    - get all Seasons with at least this year as startyear
    - for each active season:
      - get all matches >30 days out from these seasons
      - for each match:
        - get odds (in parallel)
        - update match docs (bulkwrite)
    */

  const futureDate = dayjs().add(1, "month").toDate();

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
    const matchData: Array<{ id: string; homeTeam: string; matchday: number }> =
      [];

    const matchesSnapshot = await db()
      .matches(seasonId)
      .where("kickoff", ">=", futureDate)
      .get();

    if (!matchesSnapshot?.empty) {
      matchesSnapshot?.docs.forEach((match) =>
        matchData.push({
          id: match.id,
          homeTeam: match.data().homeTeam.name.de,
          matchday: match.data().matchday,
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
    const seasonPromises = activeSeasons
      .map(async (season) => {
        if (season.id) {
          const matches = await getFutureMatches(season.id);
          const odds = await getKicktippOdds(
            "tippmaschine-wm22",
            season.seasonId,
            matches
          );

          const matchesWithOdds = matches.map((match) => {
            const odd = odds.find(
              (matchOdds) => matchOdds.matchId === match.id
            );
            return {
              matchId: match.id,
              odds: odd ? odd.odds : null,
            };
          });
          await updateMatchDocs(season.id, matchesWithOdds);
          return {
            season: season.seasonName,
            matches: matches.length,
            odds: odds.length,
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
      );
    const result = await Promise.all(seasonPromises);
    return result;
  } catch (error) {
    logger.error("Could not complete function", error);
    throw new HttpsError("internal", "Could not complete function", error);
  }
};

export default updateoddsmonthly;
