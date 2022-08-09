import { forwardRef, useState } from "react";
import { TextInputProps } from "react-native";
import { StyledTextInput, StyledView, StyledText } from "../core";
import { ControllerRenderProps, FieldError, Ref } from "react-hook-form";

type TextFieldProps = ControllerRenderProps &
  TextInputProps & {
    label?: string | undefined;
    error: FieldError | undefined;
  };

export const TextField = forwardRef<Ref, TextFieldProps>(
  ({ onBlur, onChange, value, label, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
      <StyledView width="100%" mb={"s"}>
        {label ? (
          <StyledText variant={"formLabel"} mb={"xs"}>
            {label}
          </StyledText>
        ) : null}
        <StyledView
          px="m"
          pt="s"
          pb="m"
          backgroundColor={"navigationHeader"}
          borderRadius="m"
          borderColor={
            error
              ? "accentPrimary"
              : isFocused
              ? "borderPrimary"
              : "mainBackground"
          }
          borderWidth={2}
        >
          <StyledTextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            onFocus={() => setIsFocused(true)}
            onEndEditing={() => setIsFocused(false)}
            {...props}
          />
        </StyledView>
        <StyledView height={20}>
          <StyledText variant={"errorMessage"}>
            {error ? error.message : ""}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  }
);
