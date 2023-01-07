import { MatchShort } from "./match";

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

export interface MatchDay {
  index: number;
  name: string;
  matchesShorts: MatchShort[];
  complete: boolean;
  firstKickoff: Date;
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
  currentMatchday: number;
  //players: Player[];
  pointsRules: MatchPointsRule[];
  //numberOfMatches: number;
  //numberOfPlayers: number;
  //isActive: boolean;
  //mode?: string;
  //provider: "Kicktipp";
  seasonIds: string[];
  tippsaisonId: string;
}
