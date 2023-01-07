import { ScoreStats } from "../../models/match";
import { StyledView } from "../core";
import PointBox from "./PointBox";
import TipBox from "./TipBox";

interface BoxContainerProps {
  topTips: ScoreStats[];
  tippspielId: string;
}
const BoxContainer = ({ topTips, tippspielId }: BoxContainerProps) => {
  return (
    <StyledView flexDirection={"row"} height={48}>
      <StyledView flexDirection={"row"}>
        <TipBox scoreStats={topTips[0]} tippspielId={tippspielId} />
        <TipBox scoreStats={topTips[1]} tippspielId={tippspielId} />
        <TipBox scoreStats={topTips[2]} tippspielId={tippspielId} />
      </StyledView>
      <PointBox actualPoints={4} expectedPoints={1.23} />
    </StyledView>
  );
};

export default BoxContainer;
