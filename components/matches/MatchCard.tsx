import { Image, TouchableOpacity } from "react-native";
import { NestedStackScreenProps } from "../../types";
import { StyledText, StyledView } from "../core";
import { useNavigation } from "@react-navigation/native";
import { MatchShort } from "../../models/match";

interface MatchCardProps {
  matchDetails: MatchShort;
}

const MatchCard = ({ matchDetails }: MatchCardProps) => {
  const navigation =
    useNavigation<
      NestedStackScreenProps<"MatchDetail", "MatchesTab">["navigation"]
    >();
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
      <StyledView borderRadius={"l"} padding="s" marginVertical={"s"}>
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
              source={{
                uri:
                  matchDetails.homeTeam.logoUrl !== null
                    ? matchDetails.homeTeam.logoUrl
                    : undefined,
              }}
            />
            <StyledText>{matchDetails.homeTeam.name}</StyledText>
          </StyledView>

          <StyledView mx={"s"}>
            <StyledText>{/*scoreString*/ "1:1"}</StyledText>
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
              source={{
                uri:
                  matchDetails.awayTeam.logoUrl !== null
                    ? matchDetails.awayTeam.logoUrl
                    : undefined,
              }}
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
            <StyledText>
              {matchDetails.scoreStats
                ? matchDetails.scoreStats[0].ev
                : "No Ev"}
            </StyledText>
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
