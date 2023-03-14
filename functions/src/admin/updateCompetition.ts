import dayjs = require("dayjs");
import { logger } from "firebase-functions/v1";
import {
  HttpsError,
  onCall,
  CallableRequest,
} from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import _ = require("lodash");
import { UpdateCompetitionParams } from "../../../functionTypes";
import { MatchDay } from "../../../models/competition";
import { Match, MatchShort } from "../../../models/match";
import getquotesformatchday from "../kicktipp/internal/getQuotesForMatchday";
import calculateScoreStats from "../odds/calculateScoreStats";
import { db } from "../util";

interface SeasonMatchObject {
  seasonId: string;
  matchIds: [string];
}

interface SeasonMatchData {
  seasonId: string;
  matches: {
    matchId: string;
    matchData: Match | undefined;
  }[];
}

/*
1. Get all matchdays which are active, sort asc by firstKickoff parameter and limit to x NumberofMatchdays in the future.
2. For each Matchday:

   1. Get array of MatchesShort objects
   2. For each MatchShort:

      1. Update general match statistics from season match object:
         Properties: Kickoff, score, odds
         If kickoff changed, reset submit date from competition website
      2. Update competition specific properties
         1. Check pointsRule. If quotes, get update from kicktipp
         2. Update scorestats

   3. Set complete property on Matchday object
   4. Update matchday document on Firestore

3. Update currentMatchday parameter of competition object.

*/
const updateCompetition = async ({
  competitionId,
  numberOfFutureMatchdays,
  seasonMatchData,
  loginToken,
}: UpdateCompetitionParams) => {
  const getCompetitionDetails = async () => {
    const result = await db().competitions.doc(competitionId).get();
    return result.data();
  };
  const getMatchdays = async () => {
    const matchdaysSnapshot = await db()
      .matchdays(competitionId)
      .where("complete", "==", false)
      .orderBy("firstKickoff", "asc")
      .limit(Number(numberOfFutureMatchdays))
      .get();

    if (matchdaysSnapshot.empty) {
      return null;
    }
    return matchdaysSnapshot.docs.map((d) => {
      return {
        ...d.data(),
        id: d.id,
      };
    });
  };

  const getRequiredSeasonAndMatchIds = (matchdays: MatchDay[]) => {
    const seasonIds: SeasonMatchObject[] = [];
    matchdays?.forEach((matchday) => {
      matchday.matchesShorts.forEach((matchShort) => {
        const seasonIdsIndex = seasonIds.findIndex(
          (e) => e.seasonId === matchShort.seasonId
        );
        if (seasonIdsIndex === -1) {
          seasonIds.push({
            seasonId: matchShort.seasonId,
            matchIds: [matchShort.matchId],
          });
        } else {
          seasonIds[seasonIdsIndex].matchIds.push(matchShort.matchId);
        }
      });
    });
    return seasonIds;
  };

  const getSeasonMatchData = async (seasonMatchIds: SeasonMatchObject[]) => {
    const requests = await Promise.all(
      seasonMatchIds.map(async (season) => {
        const seasonData = await Promise.all(
          season.matchIds.map(async (matchId) => {
            const matchData = await db()
              .matches(season.seasonId)
              .doc(matchId)
              .get();
            return {
              matchId: matchId,
              matchData: matchData.data(),
            };
          })
        );
        return {
          seasonId: season.seasonId,
          matches: seasonData,
        };
      })
    );
    return requests;
  };

  const updateCurrentMatchday = async (currentMatchday: number) => {
    let newCurrentMatchday = currentMatchday;
    const snapshot = await db()
      .matchdays(competitionId)
      .where("complete", "==", false)
      .orderBy("firstKickoff", "asc")
      .limit(1)
      .get();
    if (snapshot.empty) {
      const finalMatchday = await db()
        .matchdays(competitionId)
        .where("complete", "==", true)
        .orderBy("index", "desc")
        .limit(1)
        .get();
      newCurrentMatchday = finalMatchday.docs[0].data().index;
    }
    newCurrentMatchday = snapshot.docs[0].data().index;
    await db().competitions.doc(competitionId).update({
      currentMatchday: newCurrentMatchday,
    });
  };

  const updateMatchday = async (
    matchday: MatchDay,
    seasonMatchData: SeasonMatchData[],
    kurzname: string,
    tippsaisonId: string
  ) => {
    logger.info(
      `Updating matchday ${matchday.id} for competition ${competitionId}...`
    );
    const writeToFirestore = async (
      matchdayId: string,
      complete: boolean,
      matchesShorts: MatchShort[]
    ) => {
      try {
        await db().matchdays(competitionId).doc(matchdayId).update({
          complete: complete,
          matchesShorts: matchesShorts,
        });
      } catch (err) {
        logger.error("Error in writing updated matchday to Firestore", err);
      }
    };

    const matchesShorts = matchday.matchesShorts;
    const includesQuotes =
      matchesShorts.findIndex((m) => m.pointsRule.type === "quotes") === -1
        ? false
        : true;

    let newQuotes: {
      tippspielId: string | undefined;
      quotes: {
        home: number;
        draw: number;
        away: number;
      } | null;
    }[];

    if (includesQuotes) {
      newQuotes = await getquotesformatchday(
        kurzname,
        loginToken,
        matchday.index,
        tippsaisonId
      );
    }

    const newMatchShorts = matchesShorts.map((matchShort) => {
      const newMatchShort = _.cloneDeep(matchShort);
      // Update propoerties from season data
      const newSeasonMatchData = seasonMatchData
        .find((s) => s.seasonId === matchShort.seasonId)
        ?.matches.find((m) => m.matchId === matchShort.matchId)?.matchData;
      if (newSeasonMatchData) {
        if (newSeasonMatchData.kickoff.valueOf != matchShort.kickoff.valueOf) {
          newMatchShort.kickoff = newSeasonMatchData.kickoff;
          newMatchShort.submitDate = new Date(
            matchShort.submitDate.getMilliseconds() +
              newSeasonMatchData.kickoff.getMilliseconds() -
              matchShort.kickoff.getMilliseconds()
          );
        }
        newMatchShort.score = newSeasonMatchData.score;
      }
      // update competition-specific data
      if (matchShort.pointsRule.type === "quotes") {
        const newMatchQuotes = newQuotes.find(
          (m) => m.tippspielId === matchShort.tippspielId
        );
        if (
          newMatchShort.pointsRule.standardPointsRule &&
          newMatchQuotes?.quotes
        ) {
          newMatchShort.pointsRule.standardPointsRule.homeWin.difference =
            newMatchQuotes.quotes.home;
          newMatchShort.pointsRule.standardPointsRule.homeWin.tendency =
            newMatchQuotes.quotes.home;
          newMatchShort.pointsRule.standardPointsRule.homeWin.exact =
            newMatchQuotes.quotes.home;
          newMatchShort.pointsRule.standardPointsRule.awayWin.difference =
            newMatchQuotes.quotes.away;
          newMatchShort.pointsRule.standardPointsRule.awayWin.tendency =
            newMatchQuotes.quotes.away;
          newMatchShort.pointsRule.standardPointsRule.awayWin.exact =
            newMatchQuotes.quotes.away;
          newMatchShort.pointsRule.standardPointsRule.draw.exact =
            newMatchQuotes.quotes.draw;
          newMatchShort.pointsRule.standardPointsRule.draw.tendency =
            newMatchQuotes.quotes.draw;
        }
      }
      newMatchShort.scoreStats = calculateScoreStats(
        newSeasonMatchData ? newSeasonMatchData.odds : null,
        newMatchShort.pointsRule,
        9
      );
      return newMatchShort;
    });

    const newComplete = newMatchShorts.find((m) => m.score.awayTeam === null)
      ? false
      : true;
    logger.info(
      `Old matchday data: ${JSON.stringify(
        matchday
      )}, New matchdata: ${JSON.stringify(newMatchShorts)}`
    );
    await writeToFirestore(matchday.id, newComplete, newMatchShorts);
  };

  // Main function

  try {
    const competitionDetails = await getCompetitionDetails();
    if (typeof competitionDetails === "undefined") {
      logger.info("Found no details for competition");
      return;
    }
    const matchdays = await getMatchdays();
    if (matchdays === null) {
      logger.info("No matchdays to update");
      return;
    }

    if (seasonMatchData.length === 0) {
      const dataRequest = getRequiredSeasonAndMatchIds(matchdays);
      const seasonMatchDataRequest = await getSeasonMatchData(dataRequest);
      seasonMatchDataRequest.forEach((s) => seasonMatchData.push(s));
    }

    await Promise.all(
      matchdays.map(async (matchday) => {
        await updateMatchday(
          matchday,
          seasonMatchData,
          competitionDetails.kurzname,
          competitionDetails.tippsaisonId
        );
      })
    );

    await updateCurrentMatchday(competitionDetails.currentMatchday);

    return "Success";
  } catch (error) {
    logger.error("Ran into error updating competition data", error);
    throw new HttpsError("internal", "Error in updating competition data");
  }
};

export const updateCompetitionOnCall = onCall(
  { region: "europe-west1" },
  async (data: CallableRequest<UpdateCompetitionParams>) => {
    await updateCompetition(data.data);
  }
);

export const updateAllCompetitionOnSchedule = onSchedule(
  { timeZone: "Europe/Berlin", schedule: "0 4 * * *", region: "europe-west1" },
  async () => {
    /*
    1. get active seasons and data
    2. Load all competitions with an active season
    3. Iterate through competitions
    */

    const getActiveSeasonMatchData = async () => {
      const seasonSnapshots = await db()
        .seasons.where("active", "==", true)
        .get();
      const seasons = seasonSnapshots.docs.map((doc) => {
        const season = doc.data();
        season.id = doc.id;
        return season;
      });
      const startDate = dayjs().subtract(5, "day").toDate();
      const seasonsWithMatchData = await Promise.all(
        seasons.map(async (season) => {
          const matchesSnapshot = await db()
            .matches(season.id!)
            .where("kickoff", ">=", startDate)
            .get();
          const matchesData = matchesSnapshot.docs.map((doc) => {
            return { matchId: doc.id, matchData: doc.data() };
          });
          const result: SeasonMatchData = {
            seasonId: season.id!,
            matches: matchesData,
          };
          return result;
        })
      );

      return seasonsWithMatchData;
    };
    const getUserTokenforCompetition = async (competitionId: string) => {
      const profiles = await db()
        .profiles.where("myCompetitionIds", "array-contains", competitionId)
        .limit(3)
        .get();
      const tokens = profiles.docs.map((doc) => {
        const token = doc.data().loginToken;
        if (token != undefined) {
          return token;
        } else {
          return "na";
        }
      });
      return tokens.filter((t) => t != "na");
    };
    const getAllActiveCompetitionIds = async (seasonIds: string[]) => {
      const competitionSnapshot = await db()
        .competitions.where("seasonIds", "array-contains-any", seasonIds)
        .get();
      const data = await Promise.all(
        competitionSnapshot.docs.map(async (doc) => {
          const tokens = await getUserTokenforCompetition(doc.id);
          return {
            competitionId: doc.id,
            userTokens: tokens,
          };
        })
      );

      return data;
    };

    try {
      logger.info("Start execution");
      const allSeasonMatchData = await getActiveSeasonMatchData();
      logger.info(
        "Loaded all season match data",
        JSON.stringify(allSeasonMatchData)
      );
      const activeSeasonIds = allSeasonMatchData.map((s) => s.seasonId);
      logger.info("Loaded all season ids", JSON.stringify(activeSeasonIds));
      const activeCompetitionIds = await getAllActiveCompetitionIds(
        activeSeasonIds
      );
      logger.info(
        "Loaded all competition ids",
        JSON.stringify(activeCompetitionIds)
      );

      const result = await Promise.all(
        activeCompetitionIds.map(async (cObject) => {
          try {
            await updateCompetition({
              competitionId: cObject.competitionId,
              numberOfFutureMatchdays: 3,
              loginToken: cObject.userTokens[0],
              seasonMatchData: allSeasonMatchData,
            });
            return `Successfully updated ${cObject.competitionId} competition.`;
          } catch (error) {
            logger.error(
              `Error in updating competition ${cObject.competitionId}`,
              error
            );
            throw Error("Error in updating competitions.");
          }
        })
      );
      logger.info(result);
    } catch (error) {
      logger.error("Error in updating competition", error);
      throw Error("Error in updating competitions.");
    }
  }
);
