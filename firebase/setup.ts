import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth } from "firebase/auth"; // can't use getAuth due to deprecated AsyncStorage dependency
import {
  connectAuthEmulator,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const firestore = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app, "europe-west1");

// connectAuthEmulator(auth, "http://localhost:9099");
// connectFirestoreEmulator(firestore, "localhost", 8080);
// connectFunctionsEmulator(functions, "localhost", 5001);

export { app, auth, firestore, storage, functions };
