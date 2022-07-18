import { MatchGroupItem } from "../../models/match";
import { StyledText, StyledView } from "../core";

interface MatchGroupHeaderProps {
  section: MatchGroupItem;
}

const MatchGroupHeader = ({ section }: MatchGroupHeaderProps) => {
  return (
    <StyledView bg={"mainBackground"} pt={"m"}>
      <StyledText variant={"subheader"}>{section.title}</StyledText>
    </StyledView>
  );
};

export default MatchGroupHeader;
