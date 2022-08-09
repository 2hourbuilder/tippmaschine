import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, RootStackScreenProps } from "../types";

import RootTabNavigator from "./RootTabNavigator";

import ModalScreen from "../screens/modals/TestScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import IntroScreen from "../screens/onboarding/Intro";
import AddInfosScreen from "../screens/onboarding/AddInfosScreen";
import ExplainFlowScreen from "../screens/onboarding/ExplainFlowScreen";

import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../styles/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const theme = useTheme<Theme>();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={RootTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={({ navigation }: RootStackScreenProps<"Signup">) => ({
            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate("Root")}
                style={{ padding: 10 }}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={theme.colors.accentPrimary}
                />
              </TouchableOpacity>
            ),
            title: "Create new account",
          })}
        />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="AddInfos" component={AddInfosScreen} />
        <Stack.Screen name="ExplainFlow" component={ExplainFlowScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
