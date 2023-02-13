import axios from "axios";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import { APIHost, APIkey } from "./APIcredentials";
import { APIScore } from "./types";

const getScoresAPI = async (fixtureId: number) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
    params: { id: fixtureId },
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
    const scores: APIScore = response.data.response[0].score;

    return scores.fulltime;
  } catch (error) {
    logger.error("Could not get scores", error);
    throw new HttpsError("internal", "Could not get scores", error);
  }
};

export default getScoresAPI;
