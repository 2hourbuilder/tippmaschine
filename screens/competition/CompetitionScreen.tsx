import { StyleSheet, TouchableOpacity } from "react-native";
import { StyledText, StyledView } from "../../components/core";
import { Text, View } from "../../components/Themed";
import { dummyCompetition1 } from "../../data/dummyCompetitions";
import { dummyUser1 } from "../../data/dummyUser";
import { useCompetition } from "../../firebase/firestore/CompetitionContext";
import { NestedStackScreenProps } from "../../types";

interface CompetitionScreenProps {
  navigation: NestedStackScreenProps<
    "Competition",
    "CompetitionTab"
  >["navigation"];
  route: NestedStackScreenProps<"Competition", "CompetitionTab">["route"];
}

export default function CompetitionScreen({
  navigation,
  route,
}: CompetitionScreenProps) {
  const firestoreCompetition = useCompetition();
  const myCompetition = dummyUser1.myCompetitions[0];
  const competition = dummyCompetition1;
  return (
    <StyledView px={"m"}>
      <StyledText variant={"header"} textAlign="center" paddingVertical={"m"}>
        {firestoreCompetition ? firestoreCompetition.name : ""}
      </StyledText>
      <StyledText variant={"subheader"}>Scoring board</StyledText>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CompetitionSettings", {
            competitionId: competition.id,
          })
        }
      >
        <Text style={styles.title}>Edit competition settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AddCompetition")}>
        <Text style={styles.title}>Add new competition</Text>
      </TouchableOpacity>
    </StyledView>
  );
}

const styles = StyleSheet.create({
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
