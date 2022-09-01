export interface GetLoginTokenParams {
  username: string;
  password: string;
}

export interface GetLoginTokenResults {
  loginToken: string | undefined;
}

export type GetSeasonParams = {
  kurzname: string;
  loginToken: string;
};

export type GetSeasonResults = {
  seasonId: string;
  seasonName: { en: string; de: string };
};
