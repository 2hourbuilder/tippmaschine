import { Match } from "./match";

export interface GroupMember {
  position: number;
  name: string;
  matchesPlayed: number;
  points: number;
  goalDiff: number;
}

export interface Group {
  name: string;
  members: GroupMember[];
}

export interface Season {
  seasonId: string;
  tippSaisonId: string;
  seasonName: string;
  updatedAt: Date;
  id: string | null;
  groups: Group[];
  matches: Match[];
  startYear: number;
  kurzname: string;
  active: boolean;
}
