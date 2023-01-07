export interface Profile {
  myCompetitions: MyCompetition[];
  settings: ProfileSettings;
  username: string | undefined;
  loginToken: string | undefined;
}

export interface MyCompetition {
  competitionId: string | null;
  isActive: boolean;
  name: string;
  kurzname: string;
  automationEnabled: boolean;
  playerName: string;
  myTips: MyTip[];
}

export type MyTip = {
  matchday: number;
  myTips: {
    tippspielId: string | undefined;
    homeTip: number | null;
    awayTip: number | null;
  }[];
};

export interface ProfileSettings {
  appearance: "dark" | "light" | "system";
}
