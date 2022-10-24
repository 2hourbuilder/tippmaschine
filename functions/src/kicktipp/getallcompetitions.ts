import { CallableRequest, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import * as cheerio from "cheerio";
import {
  listCompetitionsParams,
  listCompetitionsResults,
} from "../../../functionTypes";

const getallcompetitions = onCall(
  { region: "europe-west1" },
  async (request: CallableRequest<listCompetitionsParams>) => {
    try {
      const getCompetitionName = async (
        kurzname: string,
        loginToken: string
      ) => {
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
      const config = {
        method: "get",
        url: "https://www.kicktipp.de/info/profil/meinetipprunden",
        headers: {
          Cookie: `kurzname=profil; login=${request.data.loginToken}; kt_browser_timezone=Europe%2FBerlin`,
        },
      };

      const response = await axios(config);
      const $ = cheerio.load(response.data);
      const competitionRows = $("div[class='menu']").children().toArray();
      const mycompetitions = await Promise.all(
        competitionRows
          .map(async (row) => {
            const kurznameRaw = $(row).find("a").attr("href");
            if (kurznameRaw) {
              const kurzname = kurznameRaw.substring(1, kurznameRaw.length - 1);
              return {
                kurzname: kurzname,
                name: await getCompetitionName(
                  kurzname,
                  request.data.loginToken
                ),
              };
            } else return null;
          })
          .filter(
            (e): e is Promise<{ kurzname: string; name: string }> => e !== null
          )
      );
      return mycompetitions as listCompetitionsResults;
    } catch (error) {
      const err = error as Error;
      logger.error("Error in listing all competitions for a user");
      throw new Error(err.message);
    }
  }
);

export default getallcompetitions;
