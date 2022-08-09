import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../styles/theme";
import { StyledButton, StyledText, StyledView } from "../../components/core";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "../../components/forms/TextField";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { changePassword } from "../../firebase/auth/AuthFunctions";
import { NestedStackScreenProps } from "../../types";

type FormData = {
  oldPassword: string;
  newPassword: string;
};

export const ChangePasswordScreen = ({
  navigation,
}: NestedStackScreenProps<"ChangePassword", "ProfileTab">) => {
  const theme = useTheme<Theme>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const [authError, setAuthError] = useState<Error>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await changePassword(data.oldPassword, data.newPassword);
      Alert.alert("Change successful!", undefined, [
        { onPress: () => navigation.goBack() },
      ]);
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
          Change Password
        </StyledText>
      </StyledView>
      <StyledView mt={"m"} width="100%" py={"m"} px="m">
        <Controller
          name="oldPassword"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter your old password.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              textContentType="password"
              name="oldPassword"
              label="Old password"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.oldPassword}
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect={false}
              secureTextEntry
            />
          )}
        />
        <Controller
          name="newPassword"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter a new password.",
            },
            minLength: {
              value: 6,
              message: "Must be at least 6 characters.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              textContentType="password"
              name="newPassword"
              label="New password"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.newPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              autoCorrect={false}
              secureTextEntry
            />
          )}
        />
      </StyledView>
      <StyledView minHeight={60} justifyContent="center" width="100%">
        {isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <StyledButton
            label="Change password"
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
