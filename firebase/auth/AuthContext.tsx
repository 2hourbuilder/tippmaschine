import React, { createContext, useContext, useEffect, useState } from "react";
import { signInAnonymously, User } from "firebase/auth/react-native";
import { onSnapshot, doc } from "firebase/firestore";
import { auth } from "../setup";
import { cloneDeep } from "lodash";
import { profilesCol } from "../firestore/helper";
import { Profile } from "../../models/profile";

interface AuthContextStructure {
  user: User | null;
  profile: Profile | undefined;
  updateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextStructure>({
  user: null,
  profile: {
    settings: { appearance: "system", language: "en-US" },
    myCompetitions: [],
    username: undefined,
  },
  updateUser: async () => {},
});

export const useUser = () => useContext(AuthContext);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | undefined>();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
      } else {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.log("Anonymous signin failed.");
        }
      }
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user !== null) {
      if (user.isAnonymous == false) {
        const profileListener = onSnapshot(
          doc(profilesCol, user.uid),
          (doc) => {
            const profile = doc.data();
            setProfile(profile);
          }
        );
        return profileListener;
      }
    }
  }, [user]);

  const updateUser = async () => {
    try {
      await auth.currentUser?.reload();
      const updatedUser = cloneDeep(auth.currentUser);
      setUser(updatedUser);
    } catch (error) {
      console.log("User could not be updated.");
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user: user,
        profile: profile,
        updateUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
