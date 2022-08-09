import { Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NestedStackScreenProps, ProfileStackParamList } from "../types";

import ProfileScreen from "../screens/profile/ProfileScreen";
import DetailSettingsScreen from "../screens/profile/DetailSettingsScreen";
import { ResetPasswordScreen } from "../screens/auth/ResetPasswordScreen";
import { ChangePasswordScreen } from "../screens/auth/ChangePasswordScreen";
import { DeleteAccountScreen } from "../screens/auth/DeleteAccountScreen";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
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
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
