export interface Team {
  id: string;
  name: string;
  logoUrl: string;
}

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
  id: string;
  kickoff: Date;
  homeTeam: Team;
  awayTeam: Team;
  matchdayId: string;
  score: Score;
  odds: Array<Odds>;
  status: "scheduled" | "live" | "finished";
}

export interface MatchGroupItem {
  title: string;
  data: Match[];
}
