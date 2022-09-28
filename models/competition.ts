import { Odds, Score } from "./match";

export interface MatchPointsRule {
  name: string;
  type: "quotes" | "9way" | "fixed";
  standardPointsRule?: {
    homeWin: {
      tendency: number;
      difference: number;
      exact: number;
    };
    draw: {
      tendency: number;
      exact: number;
    };
    awayWin: {
      tendency: number;
      difference: number;
      exact: number;
    };
  };
  fixedPointsRule?: number;
}

export interface ScoreProb {
  score: Score;
  prob: number;
}

export interface MatchShort {
  seasonId: string;
  matchId: string;
  pointsRule: MatchPointsRule;
  submitDate: Date;
  competitionMatchDay: number;
  scoreProbs: ScoreProb[] | undefined;
  odds: Odds;
  tippspielId: string | null;
}

export interface MatchDay {
  index: number;
  name: string;
  matchesShorts: MatchShort[];
}

export interface Player {
  name: string;
  pointsHistory: number;
}

export interface Competition {
  id: string | null;
  name: string;
  kurzname: string;
  matchdays?: MatchDay[];
  //players: Player[];
  pointsRules: MatchPointsRule[];
  //numberOfMatches: number;
  //numberOfPlayers: number;
  //isActive: boolean;
  //mode?: string;
  //provider: "Kicktipp";
  seasonIds: string[];
  bettingGroupId: string;
}
