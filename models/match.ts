import { Team } from "./team";

export interface Score {
  homeTeam: number | null;
  awayTeam: number | null;
}

export interface Odds {
  providerName: "Kicktipp" | "API-FOOTBALL";
  matchWinner: {
    homeWin: number;
    awayWin: number;
    draw: number;
  };
  overUnder: { threshold: number; over: number; under: number }[] | null;
  lastUpdate: Date;
}

export interface Match {
  id: string | null;
  kickoff: Date;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  odds: Odds | null;
  status: "scheduled" | "live" | "finished";
  apiFixtureId: number;
  matchday: number;
  seasonId: string;
}

export interface MatchGroupItem {
  title: string;
  data: Match[];
}
