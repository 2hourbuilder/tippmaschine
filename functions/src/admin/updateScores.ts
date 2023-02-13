import { db } from "../util";
import { logger } from "firebase-functions/v1";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { firestore } from "firebase-admin";
import { FieldPath } from "firebase-admin/firestore";
import getScoresAPI from "../api-football/getScores";

const updateScores = async () => {
  const getActiveSeasons = async () => {
    const seasonSnapshots = await db()
      .seasons.where("active", "==", true)
      .get();
    const seasons = seasonSnapshots.docs.map((doc) => {
      const season = doc.data();
      season.id = doc.id;
      return season;
    });
    return seasons;
  };

  const getFinishedMatches = async (seasonId: string) => {
    const matchData: Array<{
      id: string;
      homeTeam: string;
      matchday: number;
      fixtureId: number;
    }> = [];

    const scoreRef = new FieldPath("score", "awayTeam");
    const matchesSnapshot = await db()
      .matches(seasonId)
      .where("kickoff", "<=", new Date())
      .where(scoreRef, "==", null)
      .limit(25)
      .get();

    if (!matchesSnapshot?.empty) {
      matchesSnapshot.docs.forEach((match) =>
        matchData.push({
          id: match.id,
          homeTeam: match.data().homeTeam.name,
          matchday: match.data().matchday,
          fixtureId: match.data().apiFixtureId,
        })
      );
    }
    return matchData;
  };

  const updateMatchDocs = async (
    seasonId: string,
    matches: Array<{
      matchId: string;
      score: { awayTeam: number | null; homeTeam: number | null };
    }>
  ) => {
    const bulkWriter = firestore().bulkWriter();
    matches.forEach((match) => {
      const docRef = db().matches(seasonId).doc(match.matchId);
      bulkWriter.update(docRef, {
        score: match.score,
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
            const matches = await getFinishedMatches(season.id);
            const matchesWithScores = await Promise.all(
              matches.map(async (match) => {
                const APIScore = await getScoresAPI(match.fixtureId);
                return {
                  matchId: match.id,
                  score: APIScore
                    ? { homeTeam: APIScore.home, awayTeam: APIScore.away }
                    : { homeTeam: null, awayTeam: null },
                };
              })
            );
            await updateMatchDocs(season.id, matchesWithScores);
            return {
              season: season.seasonName,
              checkedMatches: matches.length,
            };
          } else {
            return null;
          }
        })
        .filter(
          (
            e
          ): e is Promise<{
            season: string;
            checkedMatches: number;
          }> => e != null
        )
    );

    return result;
  } catch (error) {
    logger.error("Could not complete function", error);
    throw new HttpsError("internal", "Could not complete function", error);
  }
};

export const updateScoresOnCall = onCall(
  { region: "europe-west1" },
  async () => {
    const result = await updateScores();
    return result;
  }
);

export const updateScoresOnSchedule = onSchedule(
  { timeZone: "Europe/Berlin", schedule: "0 2 * * *", region: "europe-west1" },
  async () => {
    const result = await updateScores();
    logger.info(
      "Scheduled scores update completed. Run statistics: " +
        JSON.stringify(result)
    );
  }
);
