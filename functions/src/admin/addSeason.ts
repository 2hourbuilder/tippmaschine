import {
  CallableRequest,
  onCall,
  HttpsError,
} from "firebase-functions/v2/https";
import * as stringSimilarity from "string-similarity";
import { logger } from "firebase-functions";
import { firestore } from "firebase-admin";
import axios from "axios";
import * as cheerio from "cheerio";
import * as dayjs from "dayjs";
import { GetSeasonParams, GetSeasonResults } from "../../../functionTypes";
import { Season } from "../../../models/season";
import { Match } from "../../../models/match";
import { parseKicktippDate } from "../util";
import getFixtures from "../api-football/getFixtures";
import { Team } from "../../../models/team";
import getNumberOfMatchdays from "../kicktipp/internal/getNumberOfMatchdays";
import listTeamsAPI from "../api-football/teams";

const addseason = onCall(
  { region: "europe-west1" },
  async (event: CallableRequest<GetSeasonParams>) => {
    if (!event.auth) {
      logger.info("Unauthenticated access attempt");
      throw new HttpsError("permission-denied", "Need to be authenticated");
    }

    const { kurzname, apiLeagueId, apiSeason, loginToken } = event.data;
    const fixtures = await getFixtures(apiLeagueId, apiSeason);
    let exists = false;

    const checkIfSeasonExists = async (seasonID: string) => {
      const result = await firestore()
        .collection("seasons")
        .where("seasonId", "==", seasonID)
        .get();
      return !result.empty;
    };

    const addTeam = async (name: { en: string; de: string }) => {
      const writeToFirestore = async (team: Team) => {
        const { logoUrl, name, apiId } = team;
        try {
          const ref = await firestore().collection("teams").add({
            logoUrl: logoUrl,
            apiId: apiId,
            name: name,
          });
          return ref.id;
        } catch (error) {
          logger.error("Could not add team to Firestore", error);
          throw new HttpsError(
            "internal",
            "Could not add team to Firestore",
            error
          );
        }
      };

      const createTeam = async () => {
        const teams = await listTeamsAPI(apiLeagueId, apiSeason);
        const matches = stringSimilarity.findBestMatch(
          name.en,
          teams.map((team) => team.name)
        );
        const bestmatch = teams[matches.bestMatchIndex];
        if (matches.bestMatch.rating > 0.35) {
          const team: Team = {
            id: null,
            apiId: bestmatch.id,
            name: name,
            logoUrl: bestmatch.logo,
          };
          return team;
        } else {
          console.log(
            `Best match '${bestmatch.name}' is below threshold of 0.5 with rating of ${matches.bestMatch.rating}`
          );
          return null;
        }
      };
      let team: Team | null;
      if (name.de === "unbekannt") {
        team = {
          apiId: null,
          id: null,
          logoUrl: null,
          name: name,
        };
      } else {
        team = await createTeam();
      }
      if (team) {
        const id = await writeToFirestore(team);
        team.id = id;
      } else {
        throw new Error(
          `Could not create team for given name ${name.de} / ${name.en}. `
        );
      }
      return team;
    };

    const getTeam = async (name: { en: string; de: string }) => {
      let doc = null;
      const snapshotEN = await firestore()
        .collection("teams")
        .where("name.en", "==", name.en)
        .get();
      if (snapshotEN.empty) {
        const snapshotDE = await firestore()
          .collection("teams")
          .where("name.de", "==", name.de)
          .get();
        if (!snapshotDE.empty) {
          doc = snapshotDE.docs[0];
        }
      } else {
        doc = snapshotEN.docs[0];
      }
      if (doc) {
        const team: Team = {
          id: doc.id,
          apiId: doc.data().apiId,
          logoUrl: doc.data().logoUrl,
          name: doc.data().name,
        };
        return team;
      } else {
        // add team
        console.log("Adding team: ", name.de);
        const team = await addTeam(name);
        if (team) {
          return team;
        } else {
          return null;
        }
      }
    };

    const addSeasonToFirestore = async (season: Season) => {
      const {
        seasonId,
        seasonName,
        groups,
        updatedAt,
        matches,
        startYear,
        kurzname,
      } = season;
      try {
        exists = await checkIfSeasonExists(seasonId);
        if (!exists) {
          console.log("Adding season at ", new Date().toLocaleTimeString());
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
              startYear: startYear,
              kurzname: kurzname,
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
              apiFixtureId: match.apiFixtureId,
              matchday: match.matchday,
              seasonId: seasonRef.id,
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
            Cookie: `kurzname=${kurzname}; login=${loginToken}`,
          },
        };
        const configEN = {
          method: "get",
          url: `https://www.kicktipp.com/${kurzname}/tables`,
          headers: {
            Cookie: `kurzname=${kurzname}; login=${loginToken}`,
          },
        };
        const responseDE = await axios(configDE);
        const responseEN = await axios(configEN);
        const $de = cheerio.load(responseDE.data);
        const $en = cheerio.load(responseEN.data);
        const seasonDE = $de("div[class='tabs']")
          .children()
          .not(".optiontab")
          .not(".optionoverlay")
          .toArray();
        const seasonEN = $en("div[class='tabs']")
          .children()
          .not(".optiontab")
          .not(".optionoverlay")
          .toArray();
        const seasonId = $de("a", seasonDE[0])
          .attr("href")
          ?.split("saisonId=")[1];
        const seasonName = {
          de: $de(seasonDE[0]).text(),
          en: $en(seasonEN[0]).text(),
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
          startYear: 0,
          kurzname: kurzname,
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

    const getMatchesOfMatchDay = async (
      matchDayIndex: number,
      season: Season
    ) => {
      const config = {
        method: "get",
        url: `https://www.kicktipp.de/${kurzname}/tippspielplan?&spieltagIndex=${matchDayIndex}`,
        headers: {
          Cookie: `kurzname=${kurzname}; login=${loginToken}; kt_browser_timezone=Europe%2FBerlin`,
        },
      };
      const configEN = {
        method: "get",
        url: `https://www.kicktipp.com/${kurzname}/schedule?&spieltagIndex=${matchDayIndex}`,
        headers: {
          Cookie: `kurzname=${kurzname}; login=${loginToken}; kt_browser_timezone=Europe%2FBerlin`,
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
          const homeTeam: Team | null = await getTeam({
            de: $(homeTeamName).text(),
            en: $EN(homeTeamNameEN).text(),
          });
          const awayTeam: Team | null = await getTeam({
            de: $(awayTeamName).text(),
            en: $EN(awayTeamNameEN).text(),
          });
          const kickoff = parseKicktippDate($(kickoffRaw).text());
          const apiFixtureId = homeTeam
            ? fixtures.find(
                (fixture) =>
                  dayjs
                    .unix(fixture.fixture.timestamp)
                    .isSame(dayjs(kickoff), "day") &&
                  fixture.teams.home.id === homeTeam.apiId
              )?.fixture.id
            : null;
          if (homeTeam === null) {
            console.log("Can't find team for: ", $(homeTeamName).text());
          }
          return {
            kickoff: kickoff,
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            id: null,
            odds: null,
            score: {
              homeTeam: homeTeamScore === "-" ? null : Number(homeTeamScore),
              awayTeam: awayTeamScore === "-" ? null : Number(awayTeamScore),
            },
            status: "scheduled",
            apiFixtureId:
              typeof apiFixtureId === "undefined" ? null : apiFixtureId,
            matchday: matchDayIndex,
            seasonId: season.id,
          } as Match;
        })
      );
      return matches;
    };

    const loadMatches = async (season: Season) => {
      const matchDays = Array.from(
        { length: await getNumberOfMatchdays(kurzname, loginToken) },
        (_, i) => i + 1
      );
      const matches = [] as Match[];
      await matchDays.reduce(async (p, matchday) => {
        const match = await p;
        if (match[0].kickoff) {
          matches.push(...match);
        }
        return getMatchesOfMatchDay(matchday, season);
      }, Promise.resolve([{}] as Match[]));
      return matches;
    };

    try {
      const season = await createSeasonObject();
      const matches = await loadMatches(season);
      season.matches = matches;
      season.startYear = matches[1].kickoff.getFullYear();
      await addSeasonToFirestore(season);
      const result = exists
        ? {
            message: "Season already exists",
          }
        : {
            message: `Season ${season.seasonName.de} with id ${season.seasonId} added to database.`,
          };
      return {
        seasonId: season.seasonId,
        seasonName: season.seasonName,
        message: result.message,
      } as GetSeasonResults;
    } catch (error) {
      logger.error("Could not complete function", error);
      throw new HttpsError("internal", "Could not complete function", error);
    }
  }
);

export default addseason;
