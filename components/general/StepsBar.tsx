import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../styles/theme";
import { StyledView } from "../core";

interface StepsBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepsBar({ currentStep, totalSteps }: StepsBarProps) {
  const steps = Array.from(Array(totalSteps).keys());
  const { colors } = useTheme<Theme>();
  return (
    <StyledView
      flexDirection={"row"}
      width="80%"
      justifyContent={"space-around"}
    >
      {steps.map((step, stepIdx) => (
        <StyledView
          key={stepIdx}
          flexDirection={"row"}
          alignItems="center"
          width={
            stepIdx !== steps.length - 1
              ? `${(1 / (steps.length - 1)) * 100}%`
              : 28
          }
          my="l"
        >
          <StyledView
            key={stepIdx}
            width={28}
            height={28}
            borderRadius={"xl"}
            backgroundColor={
              stepIdx < currentStep - 1 ? "accentPrimary" : "accentTertiary"
            }
            borderColor="accentPrimary"
            borderWidth={stepIdx === currentStep - 1 ? 1 : 0}
            overflow={"hidden"}
            justifyContent="center"
            alignItems={"center"}
          >
            {stepIdx <= currentStep - 1 ? (
              <MaterialIcons
                name={stepIdx === currentStep - 1 ? "circle" : "check"}
                size={14}
                color={
                  stepIdx === currentStep - 1 ? colors.accentPrimary : "white"
                }
              />
            ) : null}
          </StyledView>
          {stepIdx !== steps.length - 1 ? (
            <StyledView
              flexDirection={"row"}
              flex={1}
              flexGrow={1}
              height={2}
              backgroundColor={
                stepIdx < currentStep - 1 ? "accentPrimary" : "accentTertiary"
              }
            />
          ) : null}
        </StyledView>
      ))}
    </StyledView>
  );
}
