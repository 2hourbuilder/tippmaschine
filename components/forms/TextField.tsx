import { forwardRef, useState } from "react";
import { TextInputProps } from "react-native";
import { StyledTextInput, StyledView, StyledText } from "../core";
import { ControllerRenderProps, FieldError, Ref } from "react-hook-form";

type TextFieldProps = ControllerRenderProps &
  TextInputProps & {
    label?: string | undefined;
    onColor?: boolean | undefined;
    error: FieldError | undefined;
  };

export const TextField = forwardRef<Ref, TextFieldProps>(
  ({ onBlur, onChange, value, label, onColor, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
      <StyledView width="100%" mb={"s"}>
        {label ? (
          <StyledText
            variant={"formLabel"}
            color={onColor ? "textOnColor" : "textPrimary"}
            mb={"xs"}
          >
            {label}
          </StyledText>
        ) : null}
        <StyledView
          p="m"
          backgroundColor={onColor ? "accentTertiary" : "navigationHeader"}
          borderRadius="m"
          borderColor={
            error
              ? "accentPrimary"
              : isFocused
              ? onColor
                ? "accentPrimary"
                : "borderPrimary"
              : onColor
              ? "accentTertiary"
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
            variant="inputField"
            {...props}
          />
        </StyledView>
        <StyledView height={20}>
          <StyledText
            variant={"errorMessage"}
            color={onColor ? "textOnColor" : undefined}
          >
            {error ? error.message : ""}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  }
);
