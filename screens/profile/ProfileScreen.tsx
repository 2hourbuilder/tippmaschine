import { StyleSheet, TouchableOpacity } from "react-native";
import { StyledView } from "../../components/core";
import { Text, View } from "../../components/Themed";
import { NestedStackScreenProps } from "../../types";

export default function ProfileScreen({
  navigation,
}: NestedStackScreenProps<"Profile", "ProfileTab">) {
  return (
    <StyledView style={styles.container}>
      <Text style={styles.title}>My profile</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.title}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Intro")}>
        <Text style={styles.title}>Start onboarding flow</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("DetailSettings", { userId: "123" })}
      >
        <Text style={styles.title}>Go to detailed settings</Text>
      </TouchableOpacity>
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
