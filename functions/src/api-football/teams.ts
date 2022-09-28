import axios from "axios";
import { logger } from "firebase-functions/v1";
import { HttpsError } from "firebase-functions/v2/https";
import { APIHost, APIkey } from "./APIcredentials";
import { APISearchTeamResponse, APITeam } from "./types";

const listTeamsAPI = async (leagueId: string, season: string) => {
  const options = {
    method: "GET",
    url: "https://api-football-v1.p.rapidapi.com/v3/teams",
    params: { league: leagueId, season: season },
    headers: {
      "X-RapidAPI-Key": APIkey,
      "X-RapidAPI-Host": APIHost,
    },
  };

  try {
    const response = await axios(options);
    const teams: Array<APITeam> = response.data.response.map(
      (team: APISearchTeamResponse) => team.team
    );
    return teams;
  } catch (error) {
    logger.error("Could not get teams", error);
    throw new HttpsError("internal", "Could not get teams", error);
  }
};

export default listTeamsAPI;
