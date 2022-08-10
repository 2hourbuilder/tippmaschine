import {
  CollectionReference,
  collection,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "../setup";
import { Profile } from "../../models/profile";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const profilesCol = createCollection<Profile>("profiles");
