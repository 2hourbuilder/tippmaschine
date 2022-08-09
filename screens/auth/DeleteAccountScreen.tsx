import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../styles/theme";
import { StyledButton, StyledText, StyledView } from "../../components/core";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "../../components/forms/TextField";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { deleteAccount } from "../../firebase/auth/authFunctions";
import { NestedStackScreenProps } from "../../types";

type FormData = {
  password: string;
};

export const DeleteAccountScreen = ({
  navigation,
}: NestedStackScreenProps<"DeleteAccount", "ProfileTab">) => {
  const theme = useTheme<Theme>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      password: "",
    },
  });
  const [authError, setAuthError] = useState<Error>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await deleteAccount(data.password);
      Alert.alert("Account deleted", undefined, [
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
          Delete account
        </StyledText>
      </StyledView>
      <StyledView mt={"m"} width="100%" py={"m"} px="m">
        <Controller
          name="password"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter your password.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              textContentType="password"
              name="password"
              label="Password"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.password}
              autoCapitalize="none"
              autoComplete="password"
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
            label="Delete account"
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
