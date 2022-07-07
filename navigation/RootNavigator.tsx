import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

import RootTabNavigator from "./RootTabNavigator";

import ModalScreen from "../screens/modals/TestScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import IntroScreen from "../screens/onboarding/Intro";
import AddInfosScreen from "../screens/onboarding/AddInfosScreen";
import ExplainFlowScreen from "../screens/onboarding/ExplainFlowScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Root"
        component={RootTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Group>
      <Stack.Group>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="AddInfos" component={AddInfosScreen} />
        <Stack.Screen name="ExplainFlow" component={ExplainFlowScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
