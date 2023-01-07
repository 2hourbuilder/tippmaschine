import { functions } from "../setup";
import { httpsCallableFromURL } from "firebase/functions";
import { createFunctionURL } from "./factory";
import {
  AddCompetitionParams,
  AddCompetitionResults,
  GetLoginTokenParams,
  GetLoginTokenResults,
  UpdateOddsParams,
  UpdateOddsResults,
  GetSeasonParams,
  GetSeasonResults,
  listCompetitionsParams,
  listCompetitionsResults,
  GetMyTipsParams,
  GetMyTipsResults,
  SubmitSingleTipParams,
  SubmitSingleTipResults,
} from "../../functionTypes";

export const updateOdds = createFunctionURL<
  UpdateOddsParams,
  UpdateOddsResults
>("https://updateodds-cu35534laa-ew.a.run.app");

export const getLoginToken = createFunctionURL<
  GetLoginTokenParams,
  GetLoginTokenResults
>("https://getlogintoken-cu35534laa-ew.a.run.app");

export const getSeason = createFunctionURL<GetSeasonParams, GetSeasonResults>(
  "https://addseason-cu35534laa-ew.a.run.app"
);

export const addCompetition = createFunctionURL<
  AddCompetitionParams,
  AddCompetitionResults
>("https://addcompetition-cu35534laa-ew.a.run.app");

export const listCompetitions = createFunctionURL<
  listCompetitionsParams,
  listCompetitionsResults
>("https://getallcompetitions-cu35534laa-ew.a.run.app");

export const getMyTips = createFunctionURL<GetMyTipsParams, GetMyTipsResults>(
  "https://getmytips-cu35534laa-ew.a.run.app"
);

export const submitSingleTip = createFunctionURL<
  SubmitSingleTipParams,
  SubmitSingleTipResults
>("https://submitsingletip-cu35534laa-ew.a.run.app");
