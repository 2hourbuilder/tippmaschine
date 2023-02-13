import axios from "axios";
import * as cheerio from "cheerio";

const getquotesformatchday = async (
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
  if (matchRows.length === 0) return [];
  const dataRows = matchRows.filter((row) => $(row).children().length > 3);

  const result = dataRows.map((dataRow) => {
    const tippCell = $(dataRow).find(".kicktipp-tippabgabe");
    const tippspielId = $($(tippCell).children().toArray()[0])
      .attr("id")
      ?.split("_")[1];
    const quotesCell = $(dataRow)
      .children()
      .toArray()
      .find((e) => $(e).text().split("-").length === 3);
    const quotesRaw = $(quotesCell).text().split("-");
    let quotes = null;
    if (quotesRaw.length === 3) {
      quotes = {
        home: Number(quotesRaw[0]),
        draw: Number(quotesRaw[1]),
        away: Number(quotesRaw[2]),
      };
    }

    return {
      tippspielId: tippspielId,
      quotes: quotes,
    };
  });

  return result;
};

export default getquotesformatchday;
