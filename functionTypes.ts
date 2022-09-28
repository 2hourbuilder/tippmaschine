import { Season } from "./models/season";

export interface GetLoginTokenParams {
  username: string;
  password: string;
}

export interface GetLoginTokenResults {
  loginToken: string | undefined;
}

export interface AddCompetitionParams {
  loginToken: string;
  kurzname: string;
}

export interface AddCompetitionResults {
  competitionId: string;
}

export type GetSeasonParams = {
  kurzname: string;
  loginToken: string;
  apiLeagueId: string;
  apiSeason: string;
};

export type GetSeasonResults = {
  seasonId: string;
  seasonName: { en: string; de: string };
  message?: string;
};

export interface GetOddsMonthlyParams {}

export interface GetOddsMonthlyResults {
  seasons: Season[];
}
