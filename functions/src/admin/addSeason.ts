import {
  CallableRequest,
  onCall,
  HttpsError,
} from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { firestore } from "firebase-admin";
import axios from "axios";
import * as cheerio from "cheerio";
import { GetSeasonParams } from "../../../functionTypes";
import { Season } from "../../../models/season";
import { Match } from "../../../models/match";
import { parseKicktippDate } from "../util";
import getTeam from "./getTeam";

const checkIfSeasonExists = async (seasonID: string) => {
  const result = await firestore()
    .collection("seasons")
    .where("seasonId", "==", seasonID)
    .get();
  return !result.empty;
};

const addseason = onCall(
  { region: "europe-west1" },
  async (event: CallableRequest<GetSeasonParams>) => {
    if (!event.auth) {
      logger.info("Unauthenticated access attempt");
      throw new HttpsError("permission-denied", "Need to be authenticated");
    }

    const kurzname = event.data.kurzname;
    let exists = false;

    const getNumberOfMatchdays = async () => {
      try {
        const configMatchDays = {
          method: "get",
          url: `https://www.kicktipp.de/${kurzname}/tippspielplan`,
          headers: {
            Cookie: `kurzname=${kurzname}; login=${event.data.loginToken}`,
          },
        };
        const response = await axios(configMatchDays);
        const $ = cheerio.load(response.data);
        const numberOfMatchDays = $("div", $("div").filter(".dropdowncontent"))
          .filter(".menu")
          .children()
          .toArray().length;
        return numberOfMatchDays;
      } catch (error) {
        logger.error(
          "Could not parse number of matchdays from kicktipp",
          error
        );
        throw new HttpsError(
          "internal",
          "Could not parse number of matchdays from kicktipp",
          error
        );
      }
    };

    const addSeasonToFirestore = async (season: Season) => {
      const { seasonId, seasonName, groups, updatedAt, matches } = season;
      try {
        exists = await checkIfSeasonExists(seasonId);
        if (!exists) {
          const seasonRef = await firestore()
            .collection("seasons")
            .add({
              seasonId: seasonId,
              seasonName: seasonName,
              groups: groups,
              updatedAt: new firestore.Timestamp(
                Math.floor(updatedAt.valueOf() / 1000),
                0
              ),
            });

          const bulkWriter = firestore().bulkWriter();
          matches.forEach((match) => {
            const docRef = seasonRef.collection("matches").doc();
            bulkWriter.create(docRef, {
              kickoff: new firestore.Timestamp(
                Math.floor(match.kickoff.valueOf() / 1000),
                0
              ),
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              status: match.status,
              score: match.score,
              odds: match.odds,
            });
          });
          bulkWriter.close();
        }
      } catch (error) {
        logger.error("Could not write season data to Firestore", error);
        throw new HttpsError(
          "internal",
          "Could not write data to Firestore",
          error
        );
      }
    };

    const createSeasonObject = async () => {
      try {
        const configDE = {
          method: "get",
          url: `https://www.kicktipp.de/${kurzname}/tabellen`,
          headers: {
            Cookie: `kurzname=${kurzname}; login=${event.data.loginToken}`,
          },
        };
        const configEN = {
          method: "get",
          url: `https://www.kicktipp.com/${kurzname}/tables`,
          headers: {
            Cookie: `kurzname=${kurzname}; login=${event.data.loginToken}`,
          },
        };
        const responseDE = await axios(configDE);
        const responseEN = await axios(configEN);
        const $de = cheerio.load(responseDE.data);
        const $en = cheerio.load(responseEN.data);
        const seasonDE = $de(`a[href^='/${kurzname}/tabellen?saisonId=']`);
        const seasonEN = $en(`a[href^='/${kurzname}/tables?saisonId=']`);
        const seasonId = seasonDE.attr("href")?.split("saisonId=")[1];
        const seasonName = {
          de: seasonDE.text().split("Anzeigen")[0],
          en: seasonEN.text().split("Display")[0],
        };
        const groups = $de("table").filter(".sporttabelle").toArray();
        const groupsEN = $en("table").filter(".sporttabelle").toArray();
        const formattedgroups = groups.map((group, groupIndex) => {
          const tbody = $de("tbody", group);
          const datarowsEN = $en("tbody", groupsEN[groupIndex])
            .children()
            .toArray();

          return {
            name: {
              de: $de("th", group).filter(".mannschaft").text(),
              en: $en("th", groupsEN[groupIndex]).filter(".mannschaft").text(),
            },
            members: tbody
              .children()
              .toArray()
              .map((datarow, teamIndex) => {
                const data = $de("td", datarow).toArray();
                const dataEN = $en("td", datarowsEN[teamIndex]).toArray();
                return {
                  position: Number($de(data[0]).text().replace(".", "")),
                  name: { de: $de(data[1]).text(), en: $en(dataEN[1]).text() },
                  matchesPlayed: Number($de(data[2]).text()),
                  points: Number($de(data[3]).text()),
                  goalDiff: Number($de(data[5]).text()),
                };
              }),
          };
        });
        if (!(typeof seasonId === "string")) {
          logger.info(
            `No season could be identified for tipping round ${kurzname}`
          );
          throw new HttpsError(
            "ok",
            `No season identified: ${seasonId}, type: ${typeof seasonId}`
          );
        }
        const season: Season = {
          seasonId: seasonId,
          seasonName: seasonName,
          groups: formattedgroups,
          updatedAt: new Date(),
          id: null,
          matches: [],
        };
        return season;
      } catch (error) {
        logger.error("Could not get season data from kicktipp", error);
        throw new HttpsError(
          "internal",
          "Could not get season data from kicktipp",
          error
        );
      }
    };

    const getMatchesOfMatchDay = async (matchDayIndex: number) => {
      const config = {
        method: "get",
        url: `https://www.kicktipp.de/${kurzname}/tippspielplan?&spieltagIndex=${matchDayIndex}`,
        headers: {
          Cookie: `kurzname=${kurzname}; login=${event.data.loginToken}; kt_browser_timezone=Europe%2FBerlin`,
        },
      };
      const configEN = {
        method: "get",
        url: `https://www.kicktipp.com/${kurzname}/schedule?&spieltagIndex=${matchDayIndex}`,
        headers: {
          Cookie: `kurzname=${kurzname}; login=${event.data.loginToken}; kt_browser_timezone=Europe%2FBerlin`,
        },
      };
      const response = await axios(config);
      const responseEN = await axios(configEN);
      const $ = cheerio.load(response.data);
      const $EN = cheerio.load(responseEN.data);
      const matchRows = $("#spiele").find("tbody").children().toArray();
      const matchRowsEN = $EN("#spiele").find("tbody").children().toArray();
      const matches: Match[] = await Promise.all(
        matchRows.map(async (matchRow, rowIndex) => {
          const [kickoffRaw /* tippterminRaw */, , homeTeamName, awayTeamName] =
            $(matchRow).children().toArray();
          const [
            ,
            ,
            /* kickoffRaw */ /* tippterminRaw */ homeTeamNameEN,
            awayTeamNameEN,
          ] = $EN(matchRowsEN[rowIndex]).children().toArray();
          const [homeTeamScore, awayTeamScore] = $("td", matchRow)
            .filter(".ergebnis")
            .text()
            .split(":");
          const homeTeam = await getTeam({
            de: $(homeTeamName).text(),
            en: $EN(homeTeamNameEN).text(),
          });
          const awayTeam = await getTeam({
            de: $(awayTeamName).text(),
            en: $EN(awayTeamNameEN).text(),
          });
          return {
            kickoff: parseKicktippDate($(kickoffRaw).text()),
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            id: null,
            odds: null,
            score: {
              homeTeam: homeTeamScore === "-" ? null : Number(homeTeamScore),
              awayTeam: awayTeamScore === "-" ? null : Number(awayTeamScore),
            },
            status: "scheduled",
          } as Match;
        })
      );
      return matches;
    };

    try {
      const season = await createSeasonObject();
      const numberOfMatchDays = await getNumberOfMatchdays();
      console.log(numberOfMatchDays);
      const matches = await getMatchesOfMatchDay(1);
      season.matches = matches;
      await addSeasonToFirestore(season);
      const result = exists
        ? {
            message: "Season already exists",
          }
        : {
            message: `Season ${season.seasonName.de} with id ${season.seasonId} added to database.`,
          };
      return result;
    } catch (error) {
      logger.error("Could not complete function", error);
      throw new HttpsError("internal", "Could not complete function", error);
    }
  }
);

export default addseason;