import { User } from "firebase/auth/react-native";
import { setDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { profilesCol } from "./helper";

export const initializeProfile = async (user: User, username: string) => {
  const userRef = doc(profilesCol, user.uid);
  try {
    await setDoc(userRef, {
      myCompetitions: [],
      settings: { appearance: "system", language: "en-US" },
      username: username,
    });
  } catch (error) {
    throw Error("Couldn't initialize profile.");
  }
};

export const deleteProfile = async (user: User) => {
  const userRef = doc(profilesCol, user.uid);
  try {
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      await deleteDoc(userRef);
    }
  } catch (error) {
    throw Error("Error in deleting profile information.");
  }
};
