import { StyleSheet } from "react-native";
import { StyledView } from "../../components/core";
import MatchesList from "../../components/matches/MatchesList";
import { matchesGrouped } from "../../data/dummyMatches";
import { NestedStackScreenProps } from "../../types";

export default function MatchlistScreen({
  navigation,
}: NestedStackScreenProps<"MatchDetail", "MatchesTab">) {
  return (
    <StyledView px={"m"}>
      <MatchesList matchesGrouped={matchesGrouped} />
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
