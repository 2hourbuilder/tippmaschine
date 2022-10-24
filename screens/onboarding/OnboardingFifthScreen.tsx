import {
  StyledButton,
  StyledButtonNoColor,
  StyledText,
  StyledView,
} from "../../components/core";
import StepsBar from "../../components/general/StepsBar";
import { RootStackScreenProps } from "../../types";

export default function OnboardingFifthScreen({
  navigation,
}: RootStackScreenProps<"OnboardingFifthScreen">) {
  return (
    <StyledView
      height={"100%"}
      backgroundColor="accentSecondary"
      alignItems={"center"}
    >
      <StyledView
        alignItems={"center"}
        height={"15%"}
        justifyContent="center"
        pt={"l"}
        mt="xl"
      >
        <StepsBar currentStep={3} totalSteps={5} />
      </StyledView>
      <StyledText color={"textOnColor"} textAlign="center">
        Bitte gib deine Kicktipp-Zugangsdaten ein um eine deiner Tipprunden
        auszuwählen.
      </StyledText>
      <StyledView alignItems={"center"} px="xl">
        <StyledButtonNoColor
          label="Nein danke, ich schau erstmal"
          onPress={() => navigation.navigate("OnboardingFirstScreen")}
        />
      </StyledView>

      <StyledButton
        onPress={() => navigation.navigate("OnboardingFirstScreen")}
        label="Loslegen"
        width={"60%"}
        borderRadius="l"
        p="m"
        alignItems={"center"}
        justifyContent="center"
        mt={"l"}
      />
    </StyledView>
  );
}
