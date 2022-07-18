import { Competition } from "../models/competition";

export const dummyCompetition1: Competition = {
  id: "worldcup",
  name: "World Cup Qatar 2022",
  numberOfMatches: 50,
  numberOfPlayers: 20,
  bettingGroupId: "svsd",
  isActive: true,
  matchdays: [
    {
      id: "firstMatchday",
      index: 1,
      matchIds: ["firstMatch"],
      name: "First matchday",
    },
    {
      id: "secondMatchday",
      index: 2,
      matchIds: ["secondMatch", "thirdMatch"],
      name: "Second matchday",
    },
  ],
  pointsRule: "standard",
  seasonId: "123",
  provider: "Kicktipp",
  players: [
    { name: "Player 1", pointsHistory: 67 },
    { name: "Player 2", pointsHistory: 63 },
    { name: "Player 3", pointsHistory: 49 },
    { name: "Christopher", pointsHistory: 64 },
  ],
};
