import { createBox, createText, ColorProps } from "@shopify/restyle";
import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Theme } from "../styles/theme";

export const StyledText = createText<Theme>();

export const StyledView = createBox<Theme>();

const BaseButton = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label: string;
  };

export const StyledButton = ({ label, color, ...props }: Props) => {
  return (
    <BaseButton flexDirection="row" backgroundColor={color} {...props}>
      <StyledText variant="buttonLabel" color={color}>
        {label}
      </StyledText>
    </BaseButton>
  );
};
