import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";

export default function SignupScreen({
  navigation,
}: RootStackScreenProps<"Signup">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <TouchableOpacity onPress={() => alert("Logged in!")}>
        <Text style={styles.title}>Press to signup</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.title}>Press here to login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Root")}>
        <Text style={styles.title}>Cancel signup</Text>
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
