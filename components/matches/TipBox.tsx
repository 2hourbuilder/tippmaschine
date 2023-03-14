import { useUser } from "../../firebase/auth/AuthContext";
import { useMyFirestore } from "../../firebase/firestore/FirestoreContext";
import { submitSingleTip } from "../../firebase/functions";
import { Score, ScoreStats } from "../../models/match";
import { StyledButtonNoColor, StyledText, StyledView } from "../core";

interface TipBoxProps {
  scoreStats: ScoreStats;
  tippspielId: string | null;
}
const TipBox = ({ scoreStats, tippspielId }: TipBoxProps) => {
  const tipString = scoreStats
    ? `${scoreStats.score.homeTeam}:${scoreStats.score.awayTeam}`
    : "- : -";
  const { competitionData } = useMyFirestore();
  const { profile } = useUser();
  const myCompetition = profile?.myCompetitions.find(
    (c) => c.competitionId === competitionData?.id
  );
  const myTip = myCompetition?.myTips
    .find((tip) => tip.myTips.find((t) => t.tippspielId === tippspielId))
    ?.myTips.find((t) => t.tippspielId === tippspielId);
  return (
    <StyledButtonNoColor
      backgroundColor={"navigationHeader"}
      onPress={async () => {
        await submitSingleTip({
          awayGoals: scoreStats.score.awayTeam,
          homeGoals: scoreStats.score.homeTeam,
          kurzname: competitionData?.kurzname,
          tippSaisonId: competitionData?.tippsaisonId,
          loginToken: profile?.loginToken,
          tippspielId: tippspielId,
        });
      }}
      borderRadius="l"
      borderWidth={
        myTip?.homeTip === scoreStats?.score.homeTeam &&
        myTip?.awayTip === scoreStats?.score.awayTeam
          ? 2
          : 0
      }
      borderColor="accentPrimary"
      mx={"xs"}
    >
      <StyledView flexDirection={"column"} width={48}>
        <StyledView height={24} alignItems="center" justifyContent="center">
          <StyledText textAlign={"center"} lineHeight={20}>
            {tipString}
          </StyledText>
        </StyledView>
        <StyledView height={24}>
          <StyledText textAlign={"center"} fontSize={12} lineHeight={20}>
            {scoreStats?.ev.toFixed(2)}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledButtonNoColor>
  );
};

export default TipBox;
