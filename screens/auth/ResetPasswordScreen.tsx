import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../styles/theme";
import { StyledButton, StyledText, StyledView } from "../../components/core";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "../../components/forms/TextField";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { sendPasswordResetCode } from "../../firebase/auth/authFunctions";

type FormData = {
  email: string;
};

export const ResetPasswordScreen = () => {
  const theme = useTheme<Theme>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
    },
  });
  const [authError, setAuthError] = useState<Error>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await sendPasswordResetCode(data.email);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledView
      minHeight={"100%"}
      flexDirection={"column"}
      justifyContent={"flex-start"}
      py={"m"}
      px={"s"}
    >
      <StyledView width={"100%"} alignItems="center">
        <MaterialIcons
          name="question-answer"
          size={36}
          color={theme.colors.accentPrimary}
        />
        <StyledText mt={"m"} textAlign="center" variant={"header"}>
          Forgot your password?
        </StyledText>
      </StyledView>
      <StyledView mt={"m"} width="100%" py={"m"} px="m">
        <Controller
          name="email"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter your email.",
            },
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: "Please enter a valid email.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              textContentType="emailAddress"
              name="email"
              label="Email address"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.email}
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
            />
          )}
        />
      </StyledView>
      <StyledView minHeight={60} justifyContent="center" width="100%">
        {isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <StyledButton
            label="Send reset email"
            alignContent={"stretch"}
            borderRadius="l"
            justifyContent={"center"}
            alignItems="center"
            p="m"
            mx={"m"}
            onPress={handleSubmit(onSubmit)}
          />
        )}
      </StyledView>

      {authError ? (
        <StyledText variant={"errorMessage"} mx="m" mt={"xs"}>
          {authError.message}
        </StyledText>
      ) : null}
    </StyledView>
  );
};
