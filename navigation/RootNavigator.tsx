import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, RootStackScreenProps } from "../types";

import RootTabNavigator from "./RootTabNavigator";

import ModalScreen from "../screens/modals/TestScreen";
import SignupScreen from "../screens/auth/SignupScreen";

import { MaterialIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity } from "react-native";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../styles/theme";
import { useUser } from "../firebase/auth/AuthContext";
import { OnboardingStatusValues } from "../localStorage/types";
import { useLocalStorage } from "../localStorage/localStorageContext";
import { StyledView } from "../components/core";
import OnboardingFirstScreen from "../screens/onboarding/OnboardingFirstScreen";
import OnboardingSecondScreen from "../screens/onboarding/OnboardingSecondScreen";
import OnboardingThirdScreen from "../screens/onboarding/OnboardingThirdScreen";
import OnboardingFourthScreen from "../screens/onboarding/OnboardingFourthScreen";
import OnboardingFifthScreen from "../screens/onboarding/OnboardingFifthScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const theme = useTheme<Theme>();
  const user = useUser();
  const storage = useLocalStorage();
  const onboardingStatus = storage.async
    .onboardingStatus as OnboardingStatusValues;

  if (storage.isLoading) {
    return (
      <StyledView
        flex={1}
        bg="accentSecondary"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Image
          source={require("../assets/images/splash.png")}
          //style={{ height: 200, width: 200 }}
          resizeMode="center"
        />
      </StyledView>
    );
  }

  return (
    <Stack.Navigator>
      {onboardingStatus === "completed" ? (
        <>
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
        </>
      ) : (
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="OnboardingFirstScreen"
            component={OnboardingFirstScreen}
          />
          <Stack.Screen
            name="OnboardingSecondScreen"
            component={OnboardingSecondScreen}
          />
          <Stack.Screen
            name="OnboardingThirdScreen"
            component={OnboardingThirdScreen}
          />
          <Stack.Screen
            name="OnboardingFourthScreen"
            component={OnboardingFourthScreen}
          />
          <Stack.Screen
            name="OnboardingFifthScreen"
            component={OnboardingFifthScreen}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
}
