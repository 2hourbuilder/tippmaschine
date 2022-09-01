import { functions } from "../setup";
import { httpsCallableFromURL } from "firebase/functions";

export const createFunctionURL = <T = any, R = any>(
  url: string
): ((data: T) => Promise<R>) => {
  const callable = httpsCallableFromURL<T, R>(functions, url);
  return async (data: T) => (await callable(data)).data;
};
