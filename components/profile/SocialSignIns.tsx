import { MaterialIcons } from "@expo/vector-icons";
import { StyledView, StyledText, StyledButton } from "../core";

export const SocialSignIns = () => {
  return (
    <>
      <StyledView
        flexDirection={"row"}
        justifyContent="space-around"
        alignItems={"center"}
        my="l"
      >
        <StyledView
          height={2}
          backgroundColor="borderPrimary"
          flex={1}
          mx="m"
        />
        <StyledText color={"textSecondary"}>Or continue with</StyledText>
        <StyledView
          height={2}
          backgroundColor="borderPrimary"
          flex={1}
          mx="m"
        />
      </StyledView>
      <StyledView
        mx="s"
        flexDirection={"row"}
        justifyContent="space-around"
        alignItems={"center"}
      >
        <StyledButton
          backgroundColor={"navigationHeader"}
          borderRadius="m"
          flex={1}
          m="s"
          py="m"
          justifyContent={"center"}
          alignItems="center"
          onPress={() => alert("Sign in with social")}
        >
          <MaterialIcons name="facebook" size={36} />
        </StyledButton>
        <StyledButton
          backgroundColor={"navigationHeader"}
          borderRadius="m"
          flex={1}
          m="s"
          py="m"
          justifyContent={"center"}
          alignItems="center"
          onPress={() => alert("Sign in with social")}
        >
          <MaterialIcons name="goat" size={36} />
        </StyledButton>
        <StyledButton
          backgroundColor={"navigationHeader"}
          borderRadius="m"
          flex={1}
          m="s"
          py="m"
          justifyContent={"center"}
          alignItems="center"
          onPress={() => alert("Sign in with social")}
        >
          <MaterialIcons name="apps" size={36} />
        </StyledButton>
      </StyledView>
    </>
  );
};
