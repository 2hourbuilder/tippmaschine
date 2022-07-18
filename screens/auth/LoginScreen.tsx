import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { StyledButton } from "../../components/core";
import { Text, View } from "../../components/Themed";
import { RootStackScreenProps } from "../../types";

export default function LoginScreen({
  navigation,
}: RootStackScreenProps<"Login">) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <StyledButton
        label="Press to login"
        backgroundColor={"cardPrimaryBackground"}
        p={"m"}
        onPress={() => alert("Logged in")}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.title}>Press here to register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Root")}>
        <Text style={styles.title}>Cancel login</Text>
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
