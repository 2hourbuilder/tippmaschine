import { MyCompetition, User } from "../models/user";

const dummyMyCompetition1: MyCompetition = {
  automationEnabled: false,
  isActive: true,
  name: "World Cup Betting Round",
  playerName: "Christopher",
  username: "abc",
  password: "123",
  competitionId: "worldcup",
  myTips: [],
};

export const dummyUser1: User = {
  id: "testuser",
  isRegistered: true,
  settings: {
    createdAt: new Date(2022, 7, 1),
    language: "en-US",
    name: "Christopher",
  },
  myCompetitions: [dummyMyCompetition1],
};
