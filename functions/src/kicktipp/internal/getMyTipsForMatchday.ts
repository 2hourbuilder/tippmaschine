import axios from "axios";
import * as cheerio from "cheerio";

const getmytipsformatchday = async (
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
    const hometip = $($(tippCell).find("input[id*='heim']").toArray()[0]).attr(
      "value"
    );
    const awaytip = $($(tippCell).find("input[id*='gast']").toArray()[0]).attr(
      "value"
    );

    return {
      tippspielId: $($(tippCell).children().toArray()[0])
        .attr("id")
        ?.split("_")[1],
      homeTip: hometip ? Number(hometip) : null,
      awayTip: awaytip ? Number(awaytip) : null,
    };
  });

  return result;
};

export default getmytipsformatchday;
