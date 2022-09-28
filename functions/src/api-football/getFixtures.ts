import axios from "axios";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import { APIHost, APIkey } from "./APIcredentials";
import { APIFixture } from "./types";

const getFixtures = async (leagueId: string, season: string) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
    params: { league: leagueId, season: season },
    headers: {
      "X-RapidAPI-Key": APIkey,
      "X-RapidAPI-Host": APIHost,
    },
  };

  try {
    const response = await axios(options);
    const fixtures: Array<APIFixture> = response.data.response;
    return fixtures;
  } catch (error) {
    logger.error("Could not get fixtures", error);
    throw new HttpsError("internal", "Could not get fixtures", error);
  }
};

export default getFixtures;
