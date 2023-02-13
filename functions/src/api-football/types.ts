export interface APITeam {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface APIVenue {
  id: number;
  name: string;
  address: string;
  city: string;
  capacity: number;
  surface: string;
  image: string;
}

export interface APISearchTeamResponse {
  team: APITeam;
  venue: APIVenue;
}

export interface APIFixture {
  fixture: {
    id: number | null;
    timestamp: number;
  };
  teams: {
    home: {
      id: number;
      name: string;
    };
    away: {
      id: number;
      name: string;
    };
  };
}

export interface APIBet {
  id: number;
  name: "Match Winner" | "Goals Over/Under" | "Exact Score";
  values: { value: string; odd: number }[];
}
export interface APIBookmaker {
  id: number;
  name: string;
  bets: APIBet[];
}

export interface APIOdds {
  update: string;
  bookmakers: APIBookmaker[];
}

export interface APIScore {
  halftime: {
    away: number | null;
    home: number | null;
  };
  fulltime: {
    away: number | null;
    home: number | null;
  };
  extratime: {
    away: number | null;
    home: number | null;
  };
  penalty: {
    away: number | null;
    home: number | null;
  };
}
