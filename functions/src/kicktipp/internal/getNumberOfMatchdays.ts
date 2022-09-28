import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";

const getNumberOfMatchdays = async (kurzname: string, loginToken: string) => {
  try {
    const configMatchDays = {
      method: "get",
      url: `https://www.kicktipp.de/${kurzname}/tippspielplan`,
      headers: {
        Cookie: `kurzname=${kurzname}; login=${loginToken}`,
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
    logger.error("Could not parse number of matchdays from kicktipp", error);
    throw new HttpsError(
      "internal",
      "Could not parse number of matchdays from kicktipp",
      error
    );
  }
};

export default getNumberOfMatchdays;
