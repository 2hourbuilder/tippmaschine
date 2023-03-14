import { Image } from "react-native";
import { StyledText, StyledView } from "../../components/core";
import { Text, View } from "../../components/Themed";
import { MatchShort } from "../../models/match";
import { NestedStackScreenProps } from "../../types";

interface MatchDetailScreenProps {
  navigation: NestedStackScreenProps<"MatchDetail", "MatchesTab">["navigation"];
  route: NestedStackScreenProps<"MatchDetail", "MatchesTab">["route"];
  shortData: MatchShort;
}

export default function MatchDetailScreen({
  navigation,
  route,
}: MatchDetailScreenProps) {
  // load details with useEffect

  const matchId = route.params.matchId;
  const shortData = route.params.shortData;
  return (
    <StyledView px={"m"}>
      <StyledView
        flexDirection={"column"}
        alignItems="center"
        width={"100%"}
        py="m"
      >
        <StyledText variant={"subheader"}>
          {`${
            shortData.competitionMatchDay
          }.Spieltag  -  ${shortData.kickoff.toLocaleDateString("de-DE", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </StyledText>
      </StyledView>
      <StyledView flexDirection={"row"}>
        <StyledView
          width={"45%"}
          alignItems="flex-end"
          backgroundColor={"accentPrimary"}
        >
          {shortData.homeTeam.logoUrl ? (
            <Image
              source={{ uri: shortData.homeTeam.logoUrl }}
              width={10}
              height={10}
            />
          ) : null}
          <StyledText numberOfLines={1}>{shortData.homeTeam.name}</StyledText>
        </StyledView>
        <StyledView width={"10%"} alignItems="center">
          <StyledText>{`${
            shortData.score.homeTeam ? shortData.score.homeTeam : "-"
          } : ${
            shortData.score.awayTeam ? shortData.score.awayTeam : "-"
          }`}</StyledText>
        </StyledView>
        <StyledView width={"45%"} alignItems="flex-start">
          <StyledText numberOfLines={1}>{shortData.awayTeam.name}</StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
