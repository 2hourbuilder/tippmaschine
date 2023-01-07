import { TouchableOpacity, useWindowDimensions } from "react-native";
import { NestedStackScreenProps } from "../../types";
import { StyledText, StyledView } from "../core";
import { useNavigation } from "@react-navigation/native";
import { MatchShort } from "../../models/match";
import BoxContainer from "./BoxContainer";

interface MatchCardProps {
  matchDetails: MatchShort;
}

const MatchCard = ({ matchDetails }: MatchCardProps) => {
  const navigation =
    useNavigation<
      NestedStackScreenProps<"MatchDetail", "MatchesTab">["navigation"]
    >();
  const windowWidth = useWindowDimensions().width;
  const topTips = matchDetails.scoreStats
    ?.sort((a, b) => b.ev - a.ev)
    .slice(0, 3);
  return (
    <TouchableOpacity
      onPress={() =>
        matchDetails.matchId
          ? navigation.navigate("MatchDetail", {
              matchId: matchDetails.matchId,
            })
          : null
      }
      activeOpacity={0.8}
    >
      <StyledView
        borderRadius={"l"}
        marginVertical={"s"}
        flexDirection="row"
        backgroundColor={"cardPrimaryBackground"}
        p="s"
        justifyContent={"flex-end"}
      >
        <StyledView
          flexDirection={"column"}
          flexGrow={1}
          maxWidth={windowWidth - 216 - 32 - 20}
        >
          <StyledView flexDirection={"row"}>
            <StyledView flexShrink={1}>
              <StyledText numberOfLines={1}>
                {matchDetails.homeTeam.name}
              </StyledText>
            </StyledView>
            <StyledView
              flexDirection={"row"}
              flexGrow={1}
              justifyContent="flex-end"
              mr={"s"}
              minWidth={20}
            >
              <StyledText textAlign={"center"}>1</StyledText>
            </StyledView>
          </StyledView>
          <StyledView flexDirection={"row"}>
            <StyledView flexShrink={1}>
              <StyledText numberOfLines={1}>
                {matchDetails.awayTeam.name}
              </StyledText>
            </StyledView>
            <StyledView
              flexDirection={"row"}
              flexGrow={1}
              justifyContent="flex-end"
              mr={"s"}
              minWidth={20}
            >
              <StyledText>2</StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
        <StyledView alignItems={"center"} justifyContent="center">
          {topTips && matchDetails.tippspielId ? (
            <BoxContainer
              topTips={topTips}
              tippspielId={matchDetails.tippspielId}
            />
          ) : null}
        </StyledView>
      </StyledView>
    </TouchableOpacity>
  );
};

export default MatchCard;
