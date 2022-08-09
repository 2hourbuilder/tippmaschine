import { RootStackScreenProps } from "../../types";
import { SignUpForm } from "../../components/profile/SignUpForm";

export default function SignupScreen({
  navigation,
}: RootStackScreenProps<"Signup">) {
  return <SignUpForm />;
}
