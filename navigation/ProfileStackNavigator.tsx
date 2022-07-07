import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NestedStackScreenProps, ProfileStackParamList } from "../types";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import ProfileScreen from "../screens/profile/ProfileScreen";
import DetailSettingsScreen from "../screens/profile/DetailSettingsScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
  const colorScheme = useColorScheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({
          navigation,
        }: NestedStackScreenProps<"Profile", "ProfileTab">) => ({
          title: "Profile",
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
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="DetailSettings"
        component={DetailSettingsScreen}
        initialParams={{ userId: "123" }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
