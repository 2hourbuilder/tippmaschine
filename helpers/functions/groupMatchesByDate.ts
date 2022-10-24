import { MatchShort } from "../../models/competition";
import { MatchGroupItem } from "../../models/match";

export const groupMatchesByDate = (matchesList: MatchShort[]) => {
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
