import { functions } from "../setup";
import { httpsCallableFromURL } from "firebase/functions";
import { createFunctionURL } from "./factory";
import {
  GetLoginTokenParams,
  GetLoginTokenResults,
  GetSeasonParams,
  GetSeasonResults,
} from "../../functionTypes";

export const testFunction = httpsCallableFromURL(
  functions,
  "http://localhost:5001/tippmaschine-8fb2e/europe-west1/addteam"
);

export const getLoginToken = createFunctionURL<
  GetLoginTokenParams,
  GetLoginTokenResults
>("http://localhost:5001/tippmaschine-8fb2e/europe-west1/getlogintoken"); //"https://getlogintoken-cu35534laa-ew.a.run.app");

export const getSeason = createFunctionURL<GetSeasonParams, GetSeasonResults>(
  "http://localhost:5001/tippmaschine-8fb2e/europe-west1/getseason"
);
