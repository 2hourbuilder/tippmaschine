import { Match } from "./match";

export interface GroupMember {
  position: number;
  name: { en: string; de: string };
  matchesPlayed: number;
  points: number;
  goalDiff: number;
}

export interface Group {
  name: { en: string; de: string };
  members: GroupMember[];
}

export interface Season {
  seasonId: string;
  seasonName: { en: string; de: string };
  updatedAt: Date;
  id: string | null;
  groups: Group[];
  matches: Match[];
  startYear: number;
  kurzname: string;
}
