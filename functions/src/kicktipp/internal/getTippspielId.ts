import axios from "axios";
import * as cheerio from "cheerio";
import { parseKicktippDate } from "../../util";

const gettippspielids = async (
  kurzname: string,
  loginToken: string,
  matchDayIndex: number,
  tippsaisonId: string
) => {
  const config = {
    method: "get",
    url: `https://www.kicktipp.de/${kurzname}/tippabgabe?tippsaisonId=${tippsaisonId}&spieltagIndex=${matchDayIndex}`,
    headers: {
      Cookie: `kurzname=${kurzname}; login=${loginToken}; kt_browser_timezone=Europe%2FBerlin`,
    },
  };
  const response = await axios(config);
  const $ = cheerio.load(response.data);

  const matchRows = $("#tippabgabeSpiele").find("tbody").children().toArray();
  const dataRows = matchRows.filter((row) => $(row).children().length > 3);
  let lastSubmitDate = parseKicktippDate(
    $($(dataRows[0]).children().toArray()[0]).text()
  );

  const result = dataRows.map((dataRow) => {
    const [tippterminRaw, homeTeamName, awayTeamName] = $(dataRow)
      .children()
      .toArray();
    const tippCell = $(dataRow).find(".kicktipp-tippabgabe");
    let currentSubmitDate: Date;
    if ($(tippterminRaw).text().length == 0) {
      currentSubmitDate = lastSubmitDate;
    } else {
      currentSubmitDate = parseKicktippDate($(tippterminRaw).text());
      lastSubmitDate = currentSubmitDate;
    }
    return {
      submitDate: currentSubmitDate,
      homeTeamName: $(homeTeamName).text(),
      awayTeamName: $(awayTeamName).text(),
      tippspielId: $($(tippCell).children().toArray()[0])
        .attr("id")
        ?.split("_")[1],
    };
  });

  return result;
};

export default gettippspielids;
