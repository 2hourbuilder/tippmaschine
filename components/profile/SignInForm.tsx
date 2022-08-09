import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@shopify/restyle";
import { Theme } from "../../styles/theme";
import {
  StyledButton,
  StyledButtonNoColor,
  StyledText,
  StyledView,
} from "../core";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "../forms/TextField";
import { useNavigation } from "@react-navigation/native";
import { NestedStackScreenProps, RootStackScreenProps } from "../../types";
import { loginWithEmailAndPassword } from "../../firebase/auth/authFunctions";
import { useState } from "react";
import { ActivityIndicator } from "react-native";

type FormData = {
  email: string;
  password: string;
};

export const SignInForm = () => {
  const theme = useTheme<Theme>();
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
      email: "",
      password: "",
    },
  });
  const [authError, setAuthError] = useState<Error>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await loginWithEmailAndPassword(data.email, data.password);
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
          name="person-add"
          size={36}
          color={theme.colors.accentPrimary}
        />
        <StyledText mt={"m"} textAlign="center" variant={"header"}>
          Sign in to your account
        </StyledText>
        <StyledText mt={"s"}>
          or
          <StyledText
            color={"accentPrimary"}
            onPress={() => navigation.navigate("Signup")}
          >
            {" "}
            create a new account
          </StyledText>
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
        <Controller
          name="password"
          control={control}
          rules={{
            required: {
              value: true,
              message: "Please enter a password.",
            },
            minLength: {
              value: 6,
              message: "At least 6 characters required.",
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
            label="Login"
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
      <StyledButtonNoColor
        alignSelf={"flex-end"}
        mt="m"
        mr="m"
        label="Forgot password?"
        color={"accentPrimary"}
        onPress={() => navigation.navigate("ResetPassword")}
      />
    </StyledView>
  );
};
