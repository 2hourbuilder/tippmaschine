import { MatchShort } from "../../models/match";
import { MatchGroupItem } from "../../models/match";

export const groupMatchesByDate = (matchesList: MatchShort[]) => {
  const groupedMatches: MatchGroupItem[] = [];
  matchesList.forEach((match) => {
    const kickoffString = `${match.kickoff.toLocaleString("de-DE", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
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
