import axios from "axios";
import * as cheerio from "cheerio";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import { MatchPointsRule } from "../../../../models/competition";

const getCompetitionPointRules = async (
  kurzname: string,
  loginToken: string
) => {
  try {
    const config = {
      method: "get",
      url: `https://www.kicktipp.de/${kurzname}/spielregeln`,
      headers: {
        Cookie: `kurzname=${kurzname}; login=${loginToken}`,
      },
    };
    const response = await axios(config);
    const $ = cheerio.load(response.data);
    const pointRuleNames = $("h2:contains('Punkteregel:')").toArray();
    const pointRules = pointRuleNames.map((rule) => {
      const name = $(rule).text().split(": ")[1];
      const ruleDetails = $(rule).next("div");
      if (ruleDetails.text().includes("Tendenz")) {
        const ruleRows = $(ruleDetails)
          .find("thead")
          .next("tbody")
          .children()
          .toArray();
        const homeWinData = $(ruleRows[0]).children().toArray();
        const drawData = $(ruleRows[1]).children().toArray();
        const awayWinData =
          ruleRows.length === 2
            ? $(ruleRows[0]).children().toArray()
            : $(ruleRows[2]).children().toArray();

        return {
          name: name,
          type: ruleDetails.text().includes("Minimale Punktzahl")
            ? "quotes"
            : "9way",
          standardPointsRule: {
            homeWin: {
              tendency: Number($(homeWinData[1]).text()),
              difference: Number($(homeWinData[2]).text()),
              exact: Number($(homeWinData[3]).text()),
            },
            draw: {
              tendency: Number($(drawData[1]).text()),
              exact: Number($(drawData[3]).text()),
            },
            awayWin: {
              tendency: Number($(awayWinData[1]).text()),
              difference: Number($(awayWinData[2]).text()),
              exact: Number($(awayWinData[3]).text()),
            },
          },
        } as MatchPointsRule;
      } else {
        return {
          name: name,
          type: "fixed",
          fixedPointsRule: Number(
            $($(ruleDetails).children().toArray()[0]).text().split(": ")[1]
          ),
        } as MatchPointsRule;
      }
    });
    return pointRules;
  } catch (error) {
    logger.error("Error in getting point rules for competition", error);
    throw new HttpsError(
      "internal",
      "Errir in getting point rules for competition",
      error
    );
  }
};

export default getCompetitionPointRules;
