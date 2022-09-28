import { functions } from "../setup";
import { httpsCallableFromURL } from "firebase/functions";
import { createFunctionURL } from "./factory";
import {
  AddCompetitionParams,
  AddCompetitionResults,
  GetLoginTokenParams,
  GetLoginTokenResults,
  GetOddsMonthlyParams,
  GetOddsMonthlyResults,
  GetSeasonParams,
  GetSeasonResults,
} from "../../functionTypes";

export const getOdds = createFunctionURL<null, GetOddsMonthlyResults>(
  "http://localhost:5001/tippmaschine-8fb2e/europe-west1/findcompetition"
);

export const getLoginToken = createFunctionURL<
  GetLoginTokenParams,
  GetLoginTokenResults
>("http://localhost:5001/tippmaschine-8fb2e/europe-west1/getlogintoken"); //"https://getlogintoken-cu35534laa-ew.a.run.app");

export const getSeason = createFunctionURL<GetSeasonParams, GetSeasonResults>(
  "http://localhost:5001/tippmaschine-8fb2e/europe-west1/getseason"
);

export const addCompetition = createFunctionURL<
  AddCompetitionParams,
  AddCompetitionResults
>("http://localhost:5001/tippmaschine-8fb2e/europe-west1/addcompetition");
