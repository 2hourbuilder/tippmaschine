import axios from "axios";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import { Odds } from "../../../models/match";
import oddsToAdjProbs from "../odds/oddsToAdjProbs";
import { APIHost, APIkey } from "./APIcredentials";
import { BOOKMAKERS } from "./bookmakers";
import { APIOdds } from "./types";

const getOddsAPI = async (fixtureId: number) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/odds",
    params: { fixture: fixtureId },
    headers: {
      "X-RapidAPI-Key": APIkey,
      "X-RapidAPI-Host": APIHost,
    },
  };

  try {
    const response = await axios(options);
    if (response.data.results == 0) {
      return undefined;
    }
    const allOdds: APIOdds = response.data.response[0];
    const filteredBookies = allOdds.bookmakers.filter((bookmaker) =>
      BOOKMAKERS.find((b) => b.id === bookmaker.id)
    );

    let averageMatchOdds:
      | {
          homeWin: number;
          awayWin: number;
          draw: number;
        }
      | undefined = undefined;

    filteredBookies.forEach((bookie) => {
      const matchbet = bookie.bets.find((bet) => (bet.name = "Match Winner"));
      let count = 0;
      if (matchbet) {
        let homeprobsum = 0;
        let awayprobsum = 0;
        let drawprobsum = 0;
        const home = matchbet.values.find((b) => b.value === "Home")?.odd;
        const away = matchbet.values.find((b) => b.value === "Away")?.odd;
        const draw = matchbet.values.find((b) => b.value === "Draw")?.odd;
        if (home && away && draw) {
          const [homeProb, awayProb, drawProb] = oddsToAdjProbs([
            home,
            away,
            draw,
          ]);
          homeprobsum += homeProb;
          awayprobsum += awayProb;
          drawprobsum += drawProb;
          count += 1;
        }

        if (count > 0) {
          const adjustment = (homeprobsum + awayprobsum + drawprobsum) / count;
          averageMatchOdds = {
            homeWin: 1 / (homeprobsum / count / adjustment),
            awayWin: 1 / (awayprobsum / count / adjustment),
            draw: 1 / (drawprobsum / count / adjustment),
          };
        }
      }
    });

    const allOverUnderProbs: Array<{
      threshold: number;
      over: number[];
      under: number[];
      count: number;
    }> = [];

    filteredBookies.forEach((bookie) => {
      const overUnderbet = bookie.bets.find(
        (bet) => bet.name === "Goals Over/Under"
      );
      if (overUnderbet) {
        const overUnderOdds = overUnderbet.values;
        for (let index = 0; index < overUnderOdds.length; index++) {
          const threshold = Number(overUnderOdds[index].value.split(" ")[1]);
          if (
            threshold > 1 &&
            threshold < 5 &&
            (threshold - Math.floor(threshold)).toFixed(1) === "0.5"
          ) {
            const elementIndex = allOverUnderProbs.findIndex(
              (d) => d.threshold === threshold
            );
            const over = overUnderOdds.find(
              (o) => o.value === `Over ${threshold}`
            )?.odd;
            const under = overUnderOdds.find(
              (o) => o.value === `Under ${threshold}`
            )?.odd;
            if (over && under) {
              const [overProb, underProb] = oddsToAdjProbs([over, under]);
              if (elementIndex === -1) {
                allOverUnderProbs.push({
                  threshold: threshold,
                  over: [overProb],
                  under: [underProb],
                  count: 1,
                });
              } else {
                allOverUnderProbs[elementIndex].over.push(overProb);
                allOverUnderProbs[elementIndex].under.push(underProb);
                allOverUnderProbs[elementIndex].count += 1;
              }
            }
          }
        }
      }
    });

    const averageOverUnderOdds = allOverUnderProbs.map((threshold) => {
      const averageOver =
        threshold.over.reduce((prev, curr) => prev + curr, 0) / threshold.count;
      const averageUnder =
        threshold.under.reduce((prev, curr) => prev + curr, 0) /
        threshold.count;
      const adjustment = averageOver + averageUnder;
      return {
        threshold: threshold.threshold,
        over: 1 / (averageOver / adjustment),
        under: 1 / (averageUnder / adjustment),
      };
    });
    if (averageMatchOdds) {
      return {
        lastUpdate: new Date(),
        matchWinner: averageMatchOdds,
        overUnder:
          averageOverUnderOdds.length > 0 ? averageOverUnderOdds : null,
        providerName: "API-FOOTBALL",
      } as Odds;
    } else {
      return undefined;
    }
  } catch (error) {
    logger.error("Could not get fixtures", error);
    throw new HttpsError("internal", "Could not get fixtures", error);
  }
};

export default getOddsAPI;
