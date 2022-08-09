import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth } from "firebase/auth"; // can't use getAuth due to deprecated AsyncStorage dependency
import { getAuth, getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
