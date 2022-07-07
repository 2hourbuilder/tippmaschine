import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";

export default function IntroScreen({
  navigation,
}: RootStackScreenProps<"Intro">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity onPress={() => navigation.navigate("AddInfos")}>
        <Text>Next step</Text>
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
