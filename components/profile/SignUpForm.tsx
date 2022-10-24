import { useTheme } from "@shopify/restyle";
import { Theme } from "../../styles/theme";
import { StyledButton, StyledText, StyledView } from "../core";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "../forms/TextField";
import { useNavigation } from "@react-navigation/native";
import { NestedStackScreenProps } from "../../types";
import { signUpWithEmail } from "../../firebase/auth/authFunctions";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { useUser } from "../../firebase/auth/AuthContext";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export const SignUpForm = () => {
  const theme = useTheme<Theme>();
  const { updateUser } = useUser();
  const navigation =
    useNavigation<
      NestedStackScreenProps<"Profile", "ProfileTab">["navigation"]
    >();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });
  const [authError, setAuthError] = useState<Error>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await signUpWithEmail(data.username, data.email, data.password);
      await updateUser();
      navigation.navigate("MatchesTab");
    } catch (error) {
      if (error instanceof Error) {
        setAuthError(error);
      }
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
        <StyledText mt="s" textAlign="center" variant={"header"}>
          Hi, let's create an account
        </StyledText>
        <StyledText mt={"s"}>
          or
          <StyledText
            color={"accentPrimary"}
            onPress={() => navigation.navigate("ProfileTab")}
          >
            {" "}
            login to an existing account
          </StyledText>
        </StyledText>
      </StyledView>
      <StyledView mt={"m"} width="100%" py={"m"} px="m">
        <Controller
          name="username"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter a username.",
            },
            minLength: {
              value: 2,
              message: "Minimum 2 characters required.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              textContentType="username"
              name="username"
              label="Username"
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              error={errors.username}
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect={false}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter an email.",
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
        <Controller
          name="password"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter a password.",
            },
            minLength: {
              value: 5,
              message: "At least 5 characters required.",
            },
          }}
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              name="password"
              label="Password"
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
            label="Sign up"
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
