import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CompetitionStackParamList, NestedStackScreenProps } from "../types";

import CompetitionScreen from "../screens/competition/CompetitionScreen";
import CompetitionSettingsScreen from "../screens/competition/CompetitionSettingsScreen";
import AddCompetitionScreen from "../screens/competition/AddCompetitionScreen";

const Stack = createNativeStackNavigator<CompetitionStackParamList>();

const CompetitionStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Competition"
        component={CompetitionScreen}
        initialParams={{ competitionId: "World Cup Qatar 2022" }}
        options={({
          navigation,
        }: NestedStackScreenProps<"Competition", "CompetitionTab">) => ({
          title: "Competition",
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
      <Stack.Screen
        name="CompetitionSettings"
        component={CompetitionSettingsScreen}
      />
      <Stack.Screen name="AddCompetition" component={AddCompetitionScreen} />
    </Stack.Navigator>
  );
};

export default CompetitionStackNavigator;
