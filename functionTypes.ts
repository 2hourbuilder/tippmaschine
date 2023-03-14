import { Match } from "./models/match";

export interface GetLoginTokenParams {
  username: string;
  password: string;
}

export interface GetLoginTokenResults {
  loginToken: string | undefined;
}

export interface listCompetitionsParams {
  loginToken: string;
}

export type listCompetitionsResults = {
  kurzname: string;
  name: string;
}[];

export interface SubmitSingleTipParams {
  loginToken: string;
  kurzname: string;
  tippSaisonId: number;
  tippspielId: number;
  homeGoals: number;
  awayGoals: number;
}

export interface SubmitSingleTipResults {
  message: string;
}

export interface AddCompetitionParams {
  loginToken: string;
  kurzname: string;
}

export interface AddCompetitionResults {
  competitionId: string;
  tippsaisonId: string;
  kurzname: string;
}

export interface GetMyTipsParams {
  loginToken: string;
  kurzname: string;
  tippSaisonId: string;
  matchdays: number[];
}

export type GetMyTipsResults = {
  matchday: number;
  myTips: {
    tippspielId: string | undefined;
    homeTip: number | null;
    awayTip: number | null;
  }[];
}[];

export type GetSeasonParams = {
  kurzname: string;
  loginToken: string;
  apiLeagueId: string;
  apiSeason: string;
};

export type GetSeasonResults = {
  seasonId: string;
  seasonName: string;
  message?: string;
};

export interface UpdateOddsParams {
  loginToken: string;
  fromDaysInFuture?: number;
  untilDaysInFuture?: number;
}

export interface UpdateOddsResults {
  season: string;
  matches: number;
  odds: number;
}

export interface UpdateCompetitionParams {
  competitionId: string;
  numberOfFutureMatchdays: number;
  loginToken: string;
  seasonMatchData: {
    seasonId: string;
    matches: {
      matchId: string;
      matchData: Match | undefined;
    }[];
  }[];
}
