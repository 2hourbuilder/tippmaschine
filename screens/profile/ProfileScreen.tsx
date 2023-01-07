import { StyledButton, StyledText, StyledView } from "../../components/core";
import { SignInForm } from "../../components/profile/SignInForm";
import { useUser } from "../../firebase/auth/AuthContext";
import { logout } from "../../firebase/auth/authFunctions";
import { useLocalStorage } from "../../localStorage/localStorageContext";
import { NestedStackScreenProps } from "../../types";

export default function ProfileScreen({
  navigation,
}: NestedStackScreenProps<"Profile", "ProfileTab">) {
  const { user, profile } = useUser();
  const { async } = useLocalStorage();

  if (user === null) {
    return <SignInForm />;
  } else if (user.isAnonymous) {
    return <SignInForm />;
  }

  return (
    <StyledView
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems="center"
    >
      <StyledText variant={"header"}>Hi {profile?.username}</StyledText>
      <StyledButton label="Logout" onPress={async () => await logout()} />
      <StyledButton
        label="Change password"
        onPress={() => navigation.navigate("ChangePassword")}
      />
      <StyledButton
        label="Delete account"
        onPress={async () => navigation.navigate("DeleteAccount")}
      />
      <StyledButton
        label="Reset onboarding"
        onPress={async () => async.updateOnboardingStatus("first")}
      />
    </StyledView>
  );
}
