import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DocumentData,
  doc,
  onSnapshot,
  Unsubscribe,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../setup";
import { Competition, MatchDay } from "../../models/competition";
import { useLocalStorage } from "../../localStorage/localStorageContext";
import { competitionsCol, matchdaysCol } from "./helper";

interface FirestoreContextStructure {
  competitionData: Competition | null;
  matchdays: MatchDay[];
}

const FirestoreContext = createContext<FirestoreContextStructure>({
  competitionData: null,
  matchdays: [],
});

export const useMyFirestore = () => useContext(FirestoreContext);

type FirestoreContextProviderProps = {
  children: React.ReactNode;
};

export const FirestoreProvider = ({
  children,
}: FirestoreContextProviderProps) => {
  const { async } = useLocalStorage();
  const selectedCompetitionId = async.selectedCompetitionId;
  const [snapshotListeners, setSnapshotListeners] = useState([]);
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [matchdaysData, setMatchdaysData] = useState<MatchDay[]>([]);

  useEffect(() => {
    if (selectedCompetitionId) {
      const unsubscribe = onSnapshot(
        doc(competitionsCol, selectedCompetitionId),
        (doc) => {
          if (doc.exists()) {
            const newComp = {
              ...doc.data(),
              id: doc.id,
            } as Competition;
            setCompetition(newComp);
          } else setCompetition(null);
        }
      );
      return unsubscribe;
    }
  }, [selectedCompetitionId]);

  const addMatchday = (competitionId: string, index: number) => {
    const unsubscribe = onSnapshot(
      query(matchdaysCol(competitionId), where("index", "==", index)),
      (query) => {
        if (!query.empty) {
          const newMatchdays = [...matchdaysData];
          newMatchdays.push(query.docs[0].data());
          setMatchdaysData(newMatchdays);
        }
      }
    );
    return unsubscribe;
  };

  useEffect(() => {
    if (competition?.id) {
      setMatchdaysData([]);
      addMatchday(competition.id, 10);
    }
  }, [competition]);

  return (
    <FirestoreContext.Provider
      value={{
        competitionData: competition,
        matchdays: matchdaysData,
      }}
    >
      {children}
    </FirestoreContext.Provider>
  );
};
