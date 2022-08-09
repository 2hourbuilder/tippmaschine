export interface Profile {
  myCompetitions: MyCompetition[];
  settings: ProfileSettings;
  username: string | undefined;
}

export interface MyCompetition {
  competitionId: string;
  isActive: boolean;
  name: string;
  automationEnabled: boolean;
  username: string;
  password: string;
  playerName: string;
  myTips: MyTip[];
}

export interface MyTip {
  matchId: string;
  isSubmitted: boolean;
  homeTeam: number;
  awayTeam: number;
  expectedPoints: number;
  actualPoints: number | null;
}

export interface ProfileSettings {
  language: "en-US" | "de-DE";
  appearance: "dark" | "light" | "system";
}
