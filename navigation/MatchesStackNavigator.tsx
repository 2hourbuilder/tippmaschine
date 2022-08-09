import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MatchesStackParamList, NestedStackScreenProps } from "../types";

import Matchlist from "../screens/matches/MatchlistScreen";
import MatchDetailScreen from "../screens/matches/MatchDetailScreen";

const Stack = createNativeStackNavigator<MatchesStackParamList>();

const MatchesStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Matchlist"
        component={Matchlist}
        options={({
          navigation,
        }: NestedStackScreenProps<"Matchlist", "MatchesTab">) => ({
          title: "Matches",
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Modal")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="info-circle"
                size={25}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
    </Stack.Navigator>
  );
};

export default MatchesStackNavigator;
