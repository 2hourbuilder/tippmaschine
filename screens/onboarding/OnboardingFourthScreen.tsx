import { StyledButton, StyledText, StyledView } from "../../components/core";
import StepsBar from "../../components/general/StepsBar";
import { useLocalStorage } from "../../localStorage/localStorageContext";
import { RootStackScreenProps } from "../../types";

export default function OnboardingFourthScreen({
  route,
  navigation,
}: RootStackScreenProps<"OnboardingFourthScreen">) {
  const params = route.params;
  const storage = useLocalStorage();
  return (
    <StyledView height={"100%"} backgroundColor="accentSecondary">
      <StyledView
        alignItems={"center"}
        height={"15%"}
        justifyContent="center"
        pt={"l"}
        mt="xl"
      >
        <StepsBar currentStep={4} totalSteps={4} />
      </StyledView>
      <StyledText color={"textOnColor"} textAlign="center">
        Die Maschine ist eingerichtet. Lass uns tippen!
      </StyledText>
      <StyledView px="m">
        <StyledButton
          onPress={() => storage.async.updateOnboardingStatus("completed")}
          label="Endlich tippen!"
        />
      </StyledView>
    </StyledView>
  );
}
