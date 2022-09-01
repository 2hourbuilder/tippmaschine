import { Team } from "./team";

export interface Score {
  homeTeam: number | null;
  awayTeam: number | null;
}

export interface Odds {
  providerName: string;
  homeWin: number;
  awayWin: number;
  draw: number;
  lastUpdate: Date;
}

export interface Match {
  id: string | null;
  kickoff: Date;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  odds: Array<Odds> | null;
  status: "scheduled" | "live" | "finished";
}

export interface MatchGroupItem {
  title: string;
  data: Match[];
}
