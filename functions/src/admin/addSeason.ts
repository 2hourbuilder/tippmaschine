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

    const { apiLeagueId, apiSeason, kurzname, loginToken } = event.data;
    const fixtures = await getFixtures(apiLeagueId, apiSeason);
    const teams = await listTeamsAPI(apiLeagueId, apiSeason);
    const createdTeams: Array<Team> = [];
    const info: {
      createdTeams: number;
      getTeamCalls: number;
      loadedFromCreated: number;
      addNewRuns: number;
    } = {
      createdTeams: 0,
      addNewRuns: 0,
      getTeamCalls: 0,
      loadedFromCreated: 0,
    };
    let exists = false;

    const checkIfSeasonExists = async (seasonID: string) => {
      const result = await firestore()
        .collection("seasons")
        .where("seasonId", "==", seasonID)
        .get();
      return !result.empty;
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

    const addTeam = async (name: string) => {
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
        const matches = stringSimilarity.findBestMatch(
          name,
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
      if (name === "unbekannt") {
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
        throw new Error(`Could not create team for given name ${name}. `);
      }
      return team;
    };

    const getTeam = async (name: string) => {
      info.getTeamCalls = info.getTeamCalls + 1;
      const existingTeam = createdTeams.find((t) => t.name === name);
      if (existingTeam) {
        info.loadedFromCreated = info.loadedFromCreated + 1;
        return existingTeam;
      }
      let doc = null;
      const snapshotDE = await firestore()
        .collection("teams")
        .where("name", "==", name)
        .get();
      if (!snapshotDE.empty) {
        doc = snapshotDE.docs[0];
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
        console.log("Adding team: ", name);
        info.addNewRuns = info.addNewRuns + 1;
        const team = await addTeam(name);
        if (team) {
          createdTeams.push(team);
          info.createdTeams = info.createdTeams + 1;
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
        active,
        tippSaisonId,
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
              active: active,
              tippSaisonId: tippSaisonId,
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
        const responseDE = await axios(configDE);

        const $de = cheerio.load(responseDE.data);

        const seasonDE = $de("div[class='tabs']")
          .children()
          .not(".optiontab")
          .not(".optionoverlay")
          .toArray();
        const seasonId = $de("a", seasonDE[0])
          .attr("href")
          ?.split("saisonId=")[1];
        const seasonName = $de(seasonDE[0]).text();

        const groups = $de("table").filter(".sporttabelle").toArray();
        const formattedgroups = groups.map((group) => {
          const tbody = $de("tbody", group);

          return {
            name: $de("th", group).filter(".mannschaft").text(),
            members: tbody
              .children()
              .toArray()
              .map((datarow) => {
                const data = $de("td", datarow).toArray();
                return {
                  position: Number($de(data[0]).text().replace(".", "")),
                  name: $de(data[1]).text(),
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
          active: true,
          tippSaisonId: "",
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
      const wait = (milliseconds: number) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
      };

      await wait(matchDayIndex * 500);

      const response = await axios(config);

      const $ = cheerio.load(response.data);

      const matchRows = $("#spiele").find("tbody").children().toArray();

      const matches: Match[] = await Promise.all(
        matchRows.map(async (matchRow) => {
          const [kickoffRaw /* tippterminRaw */, , homeTeamName, awayTeamName] =
            $(matchRow).children().toArray();
          const [homeTeamScore, awayTeamScore] = $("td", matchRow)
            .filter(".ergebnis")
            .text()
            .split(":");
          const homeTeam: Team | null = await getTeam($(homeTeamName).text());
          const awayTeam: Team | null = await getTeam($(awayTeamName).text());
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
      const allMatches = await Promise.all(
        matchDays
          .map(async (matchday) => {
            const matches = await getMatchesOfMatchDay(matchday, season);
            if (matches[0].kickoff) {
              return matches;
            } else return null;
          })
          .filter((m): m is Promise<Match[]> => m != null)
      );
      return allMatches.flat();
    };

    try {
      const season = await createSeasonObject();
      const matches = await loadMatches(season);
      const tippSaisonId = await getTippsaisonId();
      season.matches = matches;
      season.startYear = matches[1].kickoff.getFullYear();
      season.tippSaisonId = tippSaisonId;
      await addSeasonToFirestore(season);
      const result = exists
        ? {
            message: "Season already exists",
          }
        : {
            message: `Season ${season.seasonName} with id ${season.seasonId} added to database.`,
          };
      return {
        seasonId: season.seasonId,
        seasonName: season.seasonName,
        message: JSON.stringify({ info: info, result: result }),
      } as GetSeasonResults;
    } catch (error) {
      logger.error("Could not complete function", error);
      throw new HttpsError("internal", "Could not complete function", error);
    }
  }
);

export default addseason;
