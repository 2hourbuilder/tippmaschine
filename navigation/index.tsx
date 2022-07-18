import { NavigationContainer } from "@react-navigation/native";
import { ColorSchemeName } from "react-native";
import { NavigationTheme, NavigationThemeDark } from "../styles/theme";

import LinkingConfiguration from "./LinkingConfiguration";
import RootNavigator from "./RootNavigator";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? NavigationThemeDark : NavigationTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}
