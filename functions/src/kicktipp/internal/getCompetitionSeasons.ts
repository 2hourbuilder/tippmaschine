import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import getSeasonIdByName from "../../firestore/getSeasonIdByName";

const getCompetitionSeasons = async (kurzname: string, loginToken: string) => {
  try {
    const config = {
      method: "get",
      url: `https://www.kicktipp.de/${kurzname}/tabellen`,
      headers: {
        Cookie: `kurzname=${kurzname}; login=${loginToken}`,
      },
    };
    const response = await axios(config);
    const $ = cheerio.load(response.data);
    const seasons = $("div[class='tabs']")
      .children()
      .not(".optiontab")
      .not(".optionoverlay")
      .toArray();
    const seasonsWithId = await Promise.all(
      seasons.map(async (season) => {
        const name = $(season).text();
        const id = await getSeasonIdByName(name);
        if (id) {
          return { name: name, id: id };
        } else {
          return null;
        }
      })
    );
    return seasonsWithId.filter(
      (s): s is { name: string; id: string } => s !== null
    );
  } catch (error) {
    logger.error("Could not get seasons from competition", error);
    throw new HttpsError(
      "internal",
      "Could not get seasons from competition",
      error
    );
  }
};

export default getCompetitionSeasons;
