import { StyledButton, StyledText, StyledView } from "../core";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "./TextField";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { getLoginToken } from "../../firebase/functions";
import { signUpWithEmail } from "../../firebase/auth/authFunctions";
import { useUser } from "../../firebase/auth/AuthContext";

type FormData = {
  email: string;
  password: string;
};

export const KicktippLoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { updateUser } = useUser();
  const [authError, setAuthError] = useState<Error>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await signUpWithEmail("Max", data.email, data.password);
      await updateUser();
      setIsSubmitting(false);
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <StyledView
      width={"100%"}
      flexDirection={"column"}
      justifyContent={"flex-start"}
      py={"m"}
      px={"s"}
    >
      <StyledView mt={"m"} width="100%" py={"m"} px="m">
        <Controller
          name="email"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Ohne deine Kicktipp Email klappt das nicht.",
            },
            pattern: {
              value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
              message: "Das ist keine richtige Emailadresse.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              textContentType="emailAddress"
              name="email"
              label="Deine Kicktipp Email"
              onColor={true}
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
        <Controller
          name="password"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Ohne Passwort kommen wir nicht weiter.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              name="password"
              label="Kicktipp Passwort"
              onColor={true}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.password}
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
            label="Meine Tipprunden abrufen"
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
        <StyledText
          variant={"errorMessage"}
          color="textOnColor"
          mx="m"
          mt={"xs"}
        >
          {authError.message}
        </StyledText>
      ) : null}
    </StyledView>
  );
};
