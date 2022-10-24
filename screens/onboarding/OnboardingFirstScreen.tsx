import { Image, Platform } from "react-native";
import { StyledButton, StyledText, StyledView } from "../../components/core";
import { RootStackScreenProps } from "../../types";

export default function OnboardingFirstScreen({
  navigation,
}: RootStackScreenProps<"OnboardingFirstScreen">) {
  return (
    <StyledView
      height={"100%"}
      backgroundColor="accentSecondary"
      alignItems={"center"}
    >
      <StyledView
        alignItems={"center"}
        height={"20%"}
        justifyContent="center"
        pt={"l"}
        mt="xl"
      >
        <StyledText
          color={"textOnColor"}
          fontFamily="Lato_700Bold"
          fontSize={36}
          lineHeight={100}
        >
          Hallo!
        </StyledText>
      </StyledView>
      <StyledView alignItems={"center"} px="xl">
        <StyledText
          color={"textOnColor"}
          textAlign="center"
          my={"m"}
          fontSize={16}
        >
          Die Tippmaschine zeigt dir die besten Tipps für deine Kicktipprunden.
        </StyledText>
        <StyledView my={"xl"}>
          <Image
            source={require("../../assets/images/logoM.png")}
            height={200}
            width={200}
          />
        </StyledView>
        <StyledText
          color={"textOnColor"}
          textAlign="center"
          my={"m"}
          fontSize={16}
        >
          Angepasst auf eure Punkteregel.
        </StyledText>
      </StyledView>

      <StyledButton
        onPress={() => navigation.navigate("OnboardingSecondScreen")}
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
