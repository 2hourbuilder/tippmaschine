import axios from "axios";
import * as cheerio from "cheerio";
import { firestore } from "firebase-admin";
import { logger } from "firebase-functions/v1";
import {
  CallableRequest,
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";
import {
  AddCompetitionParams,
  AddCompetitionResults,
} from "../../../functionTypes";
import {
  Competition,
  MatchDay,
  MatchPointsRule,
} from "../../../models/competition";
import { Match, MatchShort } from "../../../models/match";
import getMatchesBySeasonId from "../firestore/getMatchesBySeasonId";
import { db, parseKicktippDate } from "../util";
import getCompetitionPointRules from "./internal/getCompetitionPointRules";
import getCompetitionSeasons from "./internal/getCompetitionSeasons";
import getNumberOfMatchdays from "./internal/getNumberOfMatchdays";
import gettippspielids from "./internal/getTippspielId";
import calculateScoreStats from "../odds/calculateScoreStats";

const addcompetition = onCall(
  { region: "europe-west1" },
  async (request: CallableRequest<AddCompetitionParams>) => {
    if (!request.auth) {
      throw new HttpsError("permission-denied", "Need to be authenticated");
    }
    const { kurzname, loginToken } = request.data;

    const writeCompetitionToFirestore = async (
      competition: Competition,
      matchdays: MatchDay[]
    ) => {
      try {
        // check if already exists
        const snapshot = await db()
          .competitions.where("kurzname", "==", competition.kurzname)
          .get();
        if (!snapshot.empty) {
          return null;
        }
        const competitionRef = await db().competitions.add(competition);
        await competitionRef.update({
          id: firestore.FieldValue.delete(),
        });
        // Add matchday docs
        const bulkWriter = firestore().bulkWriter();
        matchdays.forEach((matchday) => {
          const docRef = competitionRef.collection("matchdays").doc();
          bulkWriter.create(docRef, matchday);
        });
        bulkWriter.close();
        return competitionRef.id;
      } catch (error) {
        logger.error("Couldn't add competition to Firestore", error);
        throw new HttpsError(
          "internal",
          "Couldn't add competition to database",
          error
        );
      }
    };

    const getTippsaisonId = async () => {
      const config = {
        method: "get",
        url: `https://www.kicktipp.de/${kurzname}/tippabgabe`,
        headers: {
          Cookie: `kurzname=${kurzname}; login=${loginToken}`,
        },
      };
      const request = await axios(config);
      const $ = cheerio.load(request.data);
      const tippsaisonId = $("a[href*='tippsaisonId']").attr("href");
      if (tippsaisonId) {
        return tippsaisonId.split("tippsaisonId=")[1].split("&")[0];
      } else {
        return "";
      }
    };

    const tippSaisonId = await getTippsaisonId();

    console.log(tippSaisonId);

    const addcompetitionName = async () => {
      const config = {
        method: "get",
        url: `https://www.kicktipp.de/${kurzname}/`,
        headers: {
          Cookie: `kurzname=${kurzname}; login=${loginToken}`,
        },
      };

      const request = await axios(config);
      const $ = cheerio.load(request.data);
      const competitionName = $("h1").filter(".line1").text();
      return competitionName;
    };

    const getAllMatches = async (seasons: { name: string; id: string }[]) => {
      const allMatchesRaw = await Promise.all(
        seasons.map(async (season) => {
          if (season.id) {
            const matches = await getMatchesBySeasonId(season.id);
            return matches;
          } else {
            return null;
          }
        })
      );
      const allMatches = allMatchesRaw.flatMap((seasonMatches) =>
        seasonMatches ? seasonMatches : []
      );
      return allMatches;
    };

    const addMatchDay = async (
      matchDayIndex: number,
      allMatches: Match[],
      pointRules: MatchPointsRule[]
    ) => {
      const config = {
        method: "get",
        url: `https://www.kicktipp.de/${kurzname}/tippspielplan?&spieltagIndex=${matchDayIndex}`,
        headers: {
          Cookie: `kurzname=${kurzname}; login=${loginToken}; kt_browser_timezone=Europe%2FBerlin`,
        },
      };
      const response = await axios(config);
      const $ = cheerio.load(response.data);
      const matchdayName = $("div[class='prevnextTitle']").text();
      const columnHeaders = $("#spiele")
        .find("thead")
        .find("th")
        .toArray()
        .map((e) => $(e).text());
      const matchRows = $("#spiele").find("tbody").children().toArray();

      const getDetail = (
        matchRow: cheerio.Element,
        colHeaders: string[],
        colName: string
      ) => {
        const colIndex = colHeaders.findIndex((e) => e === colName);
        if (colIndex >= 0) {
          return $(matchRow).children().toArray()[colIndex];
        } else {
          return undefined;
        }
      };

      const tippSpielIds = await gettippspielids(
        kurzname,
        loginToken,
        matchDayIndex,
        tippSaisonId
      );

      const matchesShortRaw = await Promise.all(
        matchRows
          .map(async (matchRow) => {
            const kickoff = parseKicktippDate(
              $(getDetail(matchRow, columnHeaders, "Termin")).text()
            );
            const submitDate = parseKicktippDate(
              $(getDetail(matchRow, columnHeaders, "Tipptermin")).text()
            );
            const homeTeamName = $(
              getDetail(matchRow, columnHeaders, "Heim")
            ).text();
            // const awayTeamName = $(
            //   getDetail(matchRow, columnHeaders, "Gast")
            // ).text();
            const pointsRuleName = $(
              getDetail(matchRow, columnHeaders, "Punkteregel")
            ).text();

            const match = allMatches.find(
              (m) =>
                m.homeTeam.name.de === homeTeamName &&
                m.kickoff.valueOf() === kickoff.valueOf()
            );
            if (match) {
              let pointsRule = pointRules.find(
                (rule) => rule.name === pointsRuleName
              );
              if (pointsRuleName.split("-").length === 3) {
                const quotes = pointsRuleName.split(" - ");
                pointsRule = pointRules.find((rule) => rule.type === "quotes");
                if (pointsRule?.standardPointsRule) {
                  pointsRule.standardPointsRule.homeWin.difference =
                    pointsRule.standardPointsRule.homeWin.difference +
                    Number(quotes[0]);
                  pointsRule.standardPointsRule.homeWin.tendency =
                    pointsRule.standardPointsRule.homeWin.tendency +
                    Number(quotes[0]);
                  pointsRule.standardPointsRule.homeWin.exact =
                    pointsRule.standardPointsRule.homeWin.exact +
                    Number(quotes[0]);
                  pointsRule.standardPointsRule.draw.tendency =
                    pointsRule.standardPointsRule.draw.tendency +
                    Number(quotes[1]);
                  pointsRule.standardPointsRule.draw.exact =
                    pointsRule.standardPointsRule.draw.exact +
                    Number(quotes[1]);
                  pointsRule.standardPointsRule.awayWin.difference =
                    pointsRule.standardPointsRule.awayWin.difference +
                    Number(quotes[2]);
                  pointsRule.standardPointsRule.awayWin.tendency =
                    pointsRule.standardPointsRule.awayWin.tendency +
                    Number(quotes[2]);
                  pointsRule.standardPointsRule.awayWin.exact =
                    pointsRule.standardPointsRule.awayWin.exact +
                    Number(quotes[2]);
                }
              }
              const sameSubmitDate = tippSpielIds.filter(
                (t) => t.submitDate.valueOf() === submitDate.valueOf()
              );
              let tippspielId: string | undefined;
              if (sameSubmitDate.length === 1) {
                tippspielId = sameSubmitDate[0].tippspielId;
              } else {
                tippspielId = sameSubmitDate.find(
                  (t) => t.homeTeamName === match.homeTeam.name.de
                )?.tippspielId;
              }

              return {
                kickoff: kickoff,
                seasonId: match.seasonId,
                matchId: match.id,
                homeTeam: match.homeTeam,
                awayTeam: match.awayTeam,
                score: match.score,
                competitionMatchDay: matchDayIndex,
                pointsRule: pointsRule,
                submitDate: submitDate,
                odds: match.odds,
                scoreStats: calculateScoreStats(match.odds, pointsRule, 9),
                tippspielId: tippspielId ? tippspielId : null,
              } as MatchShort;
            } else {
              return null;
            }
          })
          .filter((m): m is Promise<MatchShort> => m !== null)
      );
      const matchesShort = matchesShortRaw
        .filter((m) => m)
        .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
      matchesShort.forEach((m) => {
        if (!m) {
          console.log("Missing!!!");
        }
      });
      return {
        index: matchDayIndex,
        name: matchdayName,
        matchesShorts: matchesShort,
        complete: matchesShort.find(
          (match) => match.kickoff.getTime() >= new Date().getTime()
        )
          ? false
          : true,
        firstKickoff:
          matchesShort.length > 0
            ? matchesShort[0].kickoff
            : new Date(2000, 1, 1),
      } as MatchDay;
    };

    try {
      const name = await addcompetitionName();
      const seasons = await getCompetitionSeasons(kurzname, loginToken);
      const numberOfMatchdays = await getNumberOfMatchdays(
        kurzname,
        loginToken
      );
      const matchDayIndices = [...Array(numberOfMatchdays + 1).keys()].slice(1);
      const allMatches = await getAllMatches(seasons);
      const pointRules = await getCompetitionPointRules(kurzname, loginToken);
      const competition: Competition = {
        id: null,
        name: name,
        pointsRules: pointRules,
        seasonIds: seasons.map((s) => s.id),
        tippsaisonId: tippSaisonId,
        kurzname: kurzname,
      };
      const matchdays = await Promise.all(
        matchDayIndices.map(
          async (matchDayIndex) =>
            await addMatchDay(matchDayIndex, allMatches, pointRules)
        )
      );
      const competitionId = await writeCompetitionToFirestore(
        competition,
        matchdays
      );

      return {
        competitionId: competitionId,
        kurzname: kurzname,
        tippsaisonId: tippSaisonId,
      } as AddCompetitionResults;
    } catch (error) {
      logger.error("Could not add competition", error);
      throw new HttpsError("internal", "Could not add competition", error);
    }
  }
);

export default addcompetition;
