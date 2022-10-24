import {
  CollectionReference,
  collection,
  DocumentData,
} from "firebase/firestore";
import { firestore } from "../setup";
import { Profile } from "../../models/profile";
import { Competition, MatchDay } from "../../models/competition";

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};

export const profilesCol = createCollection<Profile>("profiles");
export const competitionsCol = createCollection<Competition>("competitions");
export const matchdaysCol = <T = MatchDay>(competitionId: string) => {
  return collection(
    firestore,
    "competitions",
    competitionId,
    "matchdays"
  ) as CollectionReference<T>;
};
