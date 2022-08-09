import { MyCompetition, Profile } from "../models/profile";

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

export const dummyUser1: Profile = {
  settings: {
    appearance: "system",
    language: "en-US",
  },
  myCompetitions: [dummyMyCompetition1],
};
