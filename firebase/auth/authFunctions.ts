import { auth } from "../setup";
import {
  createUserWithEmailAndPassword,
  AuthError,
  AuthErrorCodes,
  signOut,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
  ActionCodeSettings,
  deleteUser,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth/react-native";
import {
  deleteProfile,
  initializeProfile,
} from "../firestore/profileFunctions";

export const signUpWithEmail = async (
  username: string,
  email: string,
  password: string
) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(email, password);
  try {
    if (user) {
      // create account
      await linkWithCredential(user, credential); // link with existing anonymous account or
    } else {
      await createUserWithEmailAndPassword(auth, email, password); // create new (shouldn't be triggered as always anonymous)
    }
    if (user) {
      // initialize user profile
      await initializeProfile(user, username);
    }
  } catch (error) {
    const authError = error as AuthError;
    console.log(user, authError);
    switch (authError.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        throw Error("This email already exists. Please login.", authError);
      default:
        throw Error("Signup not successful.", authError);
    }
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case AuthErrorCodes.INVALID_PASSWORD:
        throw Error("Wrong password. Please try again or reset.", {
          cause: authError,
        });
      case AuthErrorCodes.NETWORK_REQUEST_FAILED || AuthErrorCodes.TIMEOUT:
        throw Error("Network error.", { cause: authError });
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        throw Error("Too many attempts. Try later", { cause: authError });
      case AuthErrorCodes.UNVERIFIED_EMAIL:
        throw Error("Please verify your email.", { cause: authError });
      case AuthErrorCodes.USER_DISABLED:
        throw Error("Account is disabled. Please contact support.", {
          cause: authError,
        });
      case AuthErrorCodes.USER_DELETED:
        throw new Error("User does not exist. Please create an account.", {
          cause: authError,
        });
      default:
        throw Error("Login not successful.", { cause: authError });
    }
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw Error("Error in signing out. Please try again.");
  }
};

export const sendPasswordResetCode = async (
  email: string,
  actionCodeSettings?: ActionCodeSettings
) => {
  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
  } catch (error) {
    const authError = error as AuthError;
    switch (authError.code) {
      case AuthErrorCodes.USER_DELETED:
        console.log("User does not exist.");
        break;

      default:
        throw Error(
          "Error in sending reset email. Please try again or contact support."
        );
    }
  }
};

export const deleteAccount = async (
  password: string,
  afterReauthentication?: boolean
) => {
  if (auth.currentUser) {
    try {
      await deleteProfile(auth.currentUser);
      await deleteUser(auth.currentUser);
    } catch (error) {
      const authError = error as AuthError;
      if (
        authError.code === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN &&
        afterReauthentication === undefined
      ) {
        console.log("Reauthenticating");
        await reAuthenticate(password);
        await deleteAccount(password, true);
      }
      console.log(authError);
      throw Error("User account could not be deleted. Please contact support.");
    }
  }
};

export const changePassword = async (
  password: string,
  newPassword: string,
  afterReauthentication?: boolean
) => {
  if (auth.currentUser) {
    try {
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      const authError = error as AuthError;
      switch (authError.code) {
        case AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN:
          if (afterReauthentication === undefined) {
            await reAuthenticate(password);
            await changePassword(password, newPassword, true);
          }
          break;
        case AuthErrorCodes.INVALID_PASSWORD:
          throw Error("Wrong password. Please try again.");
        default:
          throw Error("Password could not be updated. Please contact support.");
      }
    }
  }
};

export const reAuthenticate = async (password: string) => {
  if (auth.currentUser) {
    if (auth.currentUser.email) {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      try {
        await reauthenticateWithCredential(auth.currentUser, credential);
      } catch (error) {
        throw Error("Error during reauthentication. Please contact support.");
      }
    }
  }
};
