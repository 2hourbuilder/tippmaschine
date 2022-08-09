// This is just a helper to add the type to the db responses
import {
  CollectionReference,
  collection,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "../setup";

// Import document models

import { Profile } from "../../models/profile";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const profilesCol = createCollection<Profile>("profiles");
