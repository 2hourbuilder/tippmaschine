import { StyledText, StyledView } from "../core";

interface PointBoxProps {
  actualPoints: number | null;
  expectedPoints: number | null;
}
const PointBox = ({ actualPoints, expectedPoints }: PointBoxProps) => {
  return (
    <StyledView
      flexDirection={"column"}
      px="xs"
      minWidth={48}
      borderRadius={"l"}
    >
      <StyledView height={24} alignItems="center" justifyContent={"center"}>
        <StyledText
          textAlign={"center"}
          lineHeight={20}
          fontFamily="Lato_700Bold"
        >
          {actualPoints ? actualPoints : "-"}
        </StyledText>
      </StyledView>
      <StyledView height={24}>
        <StyledText textAlign={"center"} fontSize={12} lineHeight={20}>
          {expectedPoints ? expectedPoints.toFixed(2) : 0}
        </StyledText>
      </StyledView>
    </StyledView>
  );
};

export default PointBox;
