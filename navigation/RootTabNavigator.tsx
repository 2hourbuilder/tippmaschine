import { FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../types";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import CompetitionStackNavigator from "./CompetitionStackNavigator";
import MatchesStackNavigator from "./MatchesStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";

const BottomTab = createBottomTabNavigator<RootTabParamList>();

const RootTabNavigator = () => {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="MatchesTab"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
      defaultScreenOptions={{ headerShown: false }}
    >
      <BottomTab.Screen
        name="MatchesTab"
        component={MatchesStackNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="gamepad" color={color} />
          ),
          headerShown: false,
          title: "Matches",
        }}
      />
      <BottomTab.Screen
        name="CompetitionTab"
        component={CompetitionStackNavigator}
        options={{
          title: "Competition",
          tabBarIcon: ({ color }) => <TabBarIcon name="table" color={color} />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="id-card" color={color} />
          ),
          headerShown: false,
        }}
      />
    </BottomTab.Navigator>
  );
};

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default RootTabNavigator;
