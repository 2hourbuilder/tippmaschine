import { Image, TouchableOpacity } from "react-native";
import { Match } from "../../models/match";
import { NestedStackScreenProps } from "../../types";
import { StyledText, StyledView } from "../core";
import { useNavigation } from "@react-navigation/native";

interface MatchCardProps {
  matchDetails: Match;
}

const MatchCard = ({ matchDetails }: MatchCardProps) => {
  const navigation =
    useNavigation<
      NestedStackScreenProps<"MatchDetail", "MatchesTab">["navigation"]
    >();
  const scoreString = `${
    matchDetails.score.homeTeam ? matchDetails.score.homeTeam : "-"
  } : ${matchDetails.score.awayTeam ? matchDetails.score.awayTeam : "-"}`;
  const oddsString = `${matchDetails.odds[0].homeWin.toFixed(
    2
  )} | ${matchDetails.odds[0].draw.toFixed(
    2
  )} | ${matchDetails.odds[0].awayWin.toFixed(2)}`;
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MatchDetail", {
          matchId: matchDetails.id,
        })
      }
      activeOpacity={0.8}
    >
      <StyledView
        bg={"cardPrimaryBackground"}
        borderRadius={"l"}
        padding="s"
        marginVertical={"s"}
      >
        <StyledView
          flexDirection="row"
          justifyContent="space-between"
          paddingBottom={"s"}
        >
          <StyledView
            flexBasis={0}
            flexDirection="row"
            flexGrow={1}
            justifyContent="flex-end"
          >
            <Image
              style={{
                height: 16,
                width: 24,
                marginRight: 8,
                alignSelf: "center",
              }}
              source={{ uri: matchDetails.homeTeam.logoUrl }}
            />
            <StyledText>{matchDetails.homeTeam.name}</StyledText>
          </StyledView>

          <StyledView mx={"s"}>
            <StyledText>{scoreString}</StyledText>
          </StyledView>

          <StyledView
            flexBasis={0}
            flexDirection="row"
            flexGrow={1}
            justifyContent="flex-start"
          >
            <StyledText>{matchDetails.awayTeam.name}</StyledText>
            <Image
              style={{
                height: 16,
                width: 24,
                marginLeft: 8,
                alignSelf: "center",
              }}
              source={{ uri: matchDetails.awayTeam.logoUrl }}
            />
          </StyledView>
        </StyledView>
        <StyledView flexDirection="row" justifyContent="space-between">
          <StyledView
            flexBasis={0}
            flexDirection="row"
            flexGrow={1}
            justifyContent="flex-start"
          >
            <StyledText>{oddsString}</StyledText>
          </StyledView>
          <StyledView mx={"s"}>
            <StyledText>1:0</StyledText>
          </StyledView>
          <StyledView
            flexDirection={"row"}
            flexBasis={0}
            flexGrow={1}
            justifyContent="flex-end"
          >
            <StyledText>Exp. points: 2.44</StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </TouchableOpacity>
  );
};

export default MatchCard;
