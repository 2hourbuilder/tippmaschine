import { useEffect, useState } from "react";
import {
  StyledButton,
  StyledButtonNoColor,
  StyledText,
  StyledView,
} from "../../components/core";
import { KicktippLoginForm } from "../../components/forms/KicktippLoginForm";
import StepsBar from "../../components/general/StepsBar";
import { useUser } from "../../firebase/auth/AuthContext";
import { RootStackScreenProps } from "../../types";

export default function OnboardingSecondScreen({
  navigation,
}: RootStackScreenProps<"OnboardingSecondScreen">) {
  const { profile } = useUser();
  const loginToken = profile?.loginToken;
  useEffect(() => {
    if (loginToken) {
      navigation.navigate("OnboardingThirdScreen", {
        competitionIds: ["1", "2", "3"],
      });
    }
  }, [loginToken]);

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
        <StepsBar currentStep={2} totalSteps={4} />
      </StyledView>
      <StyledText color={"textOnColor"} textAlign="center">
        Bitte gib deine Kicktipp-Zugangsdaten ein um deine Tipprunden
        auszuwählen.
      </StyledText>
      <StyledView width={"85%"}>
        <KicktippLoginForm />
      </StyledView>
      <StyledView alignItems={"center"} px="xl" mt="l">
        <StyledButtonNoColor
          label="Nein danke, ich schau erstmal"
          color={"textOnColor"}
          onPress={() => navigation.navigate("OnboardingFourthScreen")}
        />
      </StyledView>
      <StyledView
        flexGrow={2}
        justifyContent="flex-end"
        alignItems={"center"}
        mb={"xl"}
        mx="l"
      >
        <StyledButtonNoColor
          label="Abbrechen"
          color={"textOnColor"}
          onPress={() => navigation.navigate("OnboardingFirstScreen")}
          mb="m"
        />
        <StyledText
          variant={"hintMessage"}
          color="textOnColor"
          textAlign={"center"}
        >
          Die Daten werden verschlüsselt auf deinem Gerät gespeichert.
        </StyledText>
      </StyledView>
    </StyledView>
  );
}
