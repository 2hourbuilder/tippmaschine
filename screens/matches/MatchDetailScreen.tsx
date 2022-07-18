import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { NestedStackScreenProps } from "../../types";

interface MatchDetailScreenProps {
  navigation: NestedStackScreenProps<"MatchDetail", "MatchesTab">["navigation"];
  route: NestedStackScreenProps<"MatchDetail", "MatchesTab">["route"];
}

export default function MatchDetailScreen({
  navigation,
  route,
}: MatchDetailScreenProps) {
  const matchId = route.params.matchId;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{matchId}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
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
