import { AsyncStorageFields } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function saveToAsyncStorage<T>(key: AsyncStorageFields, value: T) {
  if (typeof value === "string") {
    await AsyncStorage.setItem(key, value);
  }
}

export async function readFromAsyncStorage(key: AsyncStorageFields) {
  const result = await AsyncStorage.getItem(key);
  return result;
}
