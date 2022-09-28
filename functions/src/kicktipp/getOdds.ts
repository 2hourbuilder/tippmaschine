import axios from "axios";
import * as cheerio from "cheerio";
import { Odds } from "../../../models/match";

const getOdds = async (
  kurzname: string,
  tippSaisonId: string,
  homeTeamNameDE: string,
  matchday: number,
  loginToken: string
) => {
  const config = {
    method: "get",
    url: `https://www.kicktipp.de/${kurzname}/tippabgabe?tippsaisonId=${tippSaisonId}&spieltagIndex=${matchday.toString()}`,
    headers: {
      Cookie: `kurzname=${kurzname}; login=${loginToken}; kt_browser_timezone=Europe%2FBerlin`,
    },
  };

  const response = await axios(config);
  const $ = cheerio.load(response.data);
  const matchrows = $("#tippabgabeSpiele").find("tbody").children().toArray();
  const gameRow = matchrows.find((matchrow) => {
    const homeTeam = $(matchrow).children().toArray()[1];
    if ($(homeTeam).text() === homeTeamNameDE) {
      return true;
    } else {
      return false;
    }
  });
  if (typeof gameRow === "undefined") {
    return null;
  }
  const oddsRaw = $(".wettquote-link", gameRow).text().split("/");
  if (oddsRaw.length != 3) {
    return null;
  }
  const odds: Odds = {
    matchWinner: {
      homeWin: Number(oddsRaw[0]),
      draw: Number(oddsRaw[1]),
      awayWin: Number(oddsRaw[2]),
    },
    overUnder: null,
    lastUpdate: new Date(),
    providerName: "kicktipp",
  };
  return odds;
};

export default getOdds;
