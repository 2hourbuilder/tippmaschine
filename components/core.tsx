import { createBox, createText, ColorProps } from "@shopify/restyle";
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  TextInput,
  TextInputProps,
} from "react-native";
import { Controller, UseControllerProps, useController } from "react-hook-form";
import { Theme } from "../styles/theme";

export const StyledText = createText<Theme>();

export const StyledView = createBox<Theme>();

// Customized Button

const BaseButton = createBox<Theme, TouchableOpacityProps>(TouchableOpacity);

type Props = React.ComponentProps<typeof BaseButton> &
  ColorProps<Theme> & {
    label?: string;
    children?: React.ReactNode;
  };

export const StyledButton = ({ label, children, ...props }: Props) => {
  return (
    <BaseButton flexDirection="row" backgroundColor="accentPrimary" {...props}>
      <StyledText variant="buttonLabel">{label}</StyledText>
      {children}
    </BaseButton>
  );
};

export const StyledButtonNoColor = ({ label, color, ...props }: Props) => {
  return (
    <BaseButton flexDirection="row" {...props}>
      <StyledText color={color}>{label}</StyledText>
    </BaseButton>
  );
};

// Customized TextInput

const BaseTextInput = createText<Theme, TextInputProps>(TextInput);

type StyledTextInputProps = React.ComponentPropsWithRef<typeof BaseTextInput> &
  ColorProps<Theme>;

export const StyledTextInput = ({ color, ...props }: StyledTextInputProps) => {
  return <BaseTextInput color={color} {...props} />;
};
