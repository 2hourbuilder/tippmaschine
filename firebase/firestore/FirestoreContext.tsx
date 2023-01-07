import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DocumentData,
  doc,
  onSnapshot,
  Unsubscribe,
  query,
  where,
  Timestamp,
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
          const newMatchday = query.docs[0].data();
          const firstKickoff = newMatchday.firstKickoff as unknown;
          const firstKickoffTS = firstKickoff as Timestamp;
          newMatchday.firstKickoff = firstKickoffTS.toDate();
          const matchesWithDates = newMatchday.matchesShorts.map((match) => {
            const kickoff = match.kickoff as unknown;
            const submitDate = match.submitDate as unknown;
            const kickoffTS = kickoff as Timestamp;
            const submitDateTS = submitDate as Timestamp;
            match.kickoff = kickoffTS.toDate();
            match.submitDate = submitDateTS.toDate();
            return match;
          });
          newMatchday.matchesShorts = matchesWithDates;
          newMatchdays.push(newMatchday);
          setMatchdaysData(newMatchdays);
        }
      }
    );
    return unsubscribe;
  };

  useEffect(() => {
    if (competition?.id) {
      setMatchdaysData([]);
      addMatchday(competition.id, competition.currentMatchday);
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
