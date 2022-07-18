export interface User {
  id: string;
  myCompetitions: MyCompetition[];
  settings: UserSettings;
  isRegistered: boolean;
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

export interface UserSettings {
  name: string;
  language: "en-US" | "de-DE";
  createdAt: Date;
}
