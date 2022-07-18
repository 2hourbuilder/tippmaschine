export interface Competition {
  id: string;
  name: string;
  matchdays: MatchDay[];
  players: Player[];
  pointsRule: string;
  numberOfMatches: number;
  numberOfPlayers: number;
  isActive: boolean;
  mode?: string;
  provider: "Kicktipp";
  seasonId: string;
  bettingGroupId: string;
}

export interface MatchDay {
  id: string;
  index: number;
  name: string;
  matchIds: string[];
}

export interface Player {
  name: string;
  pointsHistory: number;
}
