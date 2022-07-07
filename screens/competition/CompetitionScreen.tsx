import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import { NestedStackScreenProps } from "../../types";

export default function CompetitionScreen({
  navigation,
  route,
}: NestedStackScreenProps<"Competition", "CompetitionTab">) {
  const competitionId = route.params.competitionId;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{competitionId}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CompetitionSettings", {
            competitionId: competitionId,
          })
        }
      >
        <Text style={styles.title}>Edit competition settings</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("AddCompetition")}>
        <Text style={styles.title}>Add new competition</Text>
      </TouchableOpacity>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
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
