import { Match, MatchGroupItem, Team } from "../models/match";

export const brazil: Team = {
  id: "biublsf",
  logoUrl: "https://freesvg.org/img/brazil.png",
  name: "Brazil",
};

export const england: Team = {
  id: "iublibvse",
  logoUrl:
    "https://freesvg.org/img/Anonymous-Flag-of-England-United-Kingdom.png",
  name: "England",
};

export const germany: Team = {
  id: "huibflisbf",
  logoUrl: "https://freesvg.org/img/Anonymous-Flag-of-Germany.png",
  name: "Germany",
};

export const matches: Match[] = [
  {
    awayTeam: germany,
    homeTeam: brazil,
    id: "firstMatch",
    kickoff: new Date(2022, 11, 22, 18),
    apiFixtureId: 1,
    matchday: 1,
    seasonId: "1",
    odds: {
      matchWinner: {
        awayWin: 2.42,
        draw: 3.1,
        homeWin: 1.96,
      },
      overUnder: null,
      lastUpdate: new Date(),
      providerName: "Kicktipp",
    },
    score: {
      awayTeam: null,
      homeTeam: null,
    },
    status: "scheduled",
  },
  {
    awayTeam: germany,
    homeTeam: england,
    id: "secondMatch",
    kickoff: new Date(2022, 11, 23, 15),
    apiFixtureId: 1,
    matchday: 1,
    seasonId: "1",
    odds: {
      matchWinner: {
        awayWin: 2.42,
        draw: 3.1,
        homeWin: 1.96,
      },
      overUnder: null,
      lastUpdate: new Date(),
      providerName: "Kicktipp",
    },
    score: {
      awayTeam: null,
      homeTeam: null,
    },
    status: "scheduled",
  },
  {
    awayTeam: england,
    homeTeam: brazil,
    id: "thirdMatch",
    kickoff: new Date(2022, 11, 23, 15),
    apiFixtureId: 1,
    matchday: 1,
    seasonId: "1",
    odds: {
      matchWinner: {
        awayWin: 2.42,
        draw: 3.1,
        homeWin: 1.96,
      },
      overUnder: null,
      lastUpdate: new Date(),
      providerName: "Kicktipp",
    },
    score: {
      awayTeam: null,
      homeTeam: null,
    },
    status: "scheduled",
  },
];

const groupMatchesByDate = (matchesList: Match[]) => {
  const groupedMatches: MatchGroupItem[] = [];
  matchesList.forEach((match) => {
    const kickoffString = `${match.kickoff.toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      hour: "numeric",
      hour12: true,
      minute: "2-digit",
    })}`;
    const index: number = groupedMatches.findIndex(
      (e) => e.title === kickoffString
    );
    if (index >= 0) {
      groupedMatches[index].data.push(match);
    } else {
      groupedMatches.push({ title: kickoffString, data: [match] });
    }
  });
  return groupedMatches;
};
export const matchesGrouped = groupMatchesByDate(matches);
