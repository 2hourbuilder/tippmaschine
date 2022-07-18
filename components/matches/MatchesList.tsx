import { SectionList, ListRenderItem } from "react-native";
import { Match, MatchGroupItem } from "../../models/match";
import { StyledView } from "../core";
import MatchCard from "./MatchCard";
import MatchGroupHeader from "./MatchGroupHeader";

const renderItem: ListRenderItem<Match> = ({ item }) => {
  return <MatchCard matchDetails={item} key={item.id} />;
};

const renderSectionHeader = (section: MatchGroupItem) => {
  return <MatchGroupHeader section={section} />;
};

interface MatchesListProps {
  matchesGrouped: MatchGroupItem[];
}

const MatchesList = ({ matchesGrouped }: MatchesListProps) => {
  return (
    <StyledView width={"100%"}>
      <SectionList
        sections={matchesGrouped}
        renderItem={(item) => renderItem(item)}
        renderSectionHeader={({ section }) => renderSectionHeader(section)}
      />
    </StyledView>
  );
};

export default MatchesList;
