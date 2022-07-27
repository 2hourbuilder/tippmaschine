import React, { createContext, useContext, useEffect, useState } from "react";
import { DocumentData, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../setup";

const CompetitionContext = createContext<DocumentData | null | undefined>(null);

export const useCompetition = () => useContext(CompetitionContext);

type CompetitionProviderProps = {
  children: React.ReactNode;
};

export const CompetitionProvider = ({ children }: CompetitionProviderProps) => {
  const [competition, setCompetition] = useState<
    DocumentData | null | undefined
  >(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(firestore, "competitions", "sbCcMobrrQEJ0TPNj0uC"),
      (doc) => {
        setCompetition(doc.data());
      }
    );

    return unsubscribe;
  }, []);

  return (
    <CompetitionContext.Provider value={competition}>
      {children}
    </CompetitionContext.Provider>
  );
};
