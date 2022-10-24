import React, { useContext, createContext, useState, useEffect } from "react";
import { LocalStorageSchema, OnboardingStatusValues } from "./types";
import { readFromAsyncStorage, saveToAsyncStorage } from "./asyncStorage";

const LocalStorage = createContext<LocalStorageSchema>({
  async: {
    onboardingStatus: null,
    updateOnboardingStatus: async () => {},
    selectedCompetitionId: null,
    updateSelectedCompetitionId: async () => {},
  },
  secure: { ktLoginToken: null },
  isLoading: true,
});

export const useLocalStorage = () => useContext(LocalStorage);

type LocalStorageProviderProps = {
  children: React.ReactNode;
};

export const LocalStorageProvider = ({
  children,
}: LocalStorageProviderProps) => {
  const [onboardingStatus, setOnboardingStatus] = useState<string | null>(null);
  const [ktLoginToken, setKtLoginToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<
    string | null
  >(null);

  const updateOnboardingStatus = async (value: OnboardingStatusValues) => {
    setOnboardingStatus(value);
    await saveToAsyncStorage("onboardingStatus", value);
  };

  const updateSelectedCompetitionId = async (id: string) => {
    setSelectedCompetitionId(id);
    await saveToAsyncStorage("selectedCompetitionId", id);
  };

  useEffect(() => {
    const readStorage = async () => {
      const onboardingStatusStored = await readFromAsyncStorage(
        "onboardingStatus"
      );
      onboardingStatusStored
        ? setOnboardingStatus(onboardingStatusStored)
        : setOnboardingStatus(null);
      const selectedCompetitionId = await readFromAsyncStorage(
        "selectedCompetitionId"
      );
      selectedCompetitionId
        ? setSelectedCompetitionId(selectedCompetitionId)
        : setSelectedCompetitionId(null);

      setIsLoading(false);
    };
    readStorage();
  }, []);

  return (
    <LocalStorage.Provider
      value={{
        async: {
          onboardingStatus: onboardingStatus,
          updateOnboardingStatus: updateOnboardingStatus,
          selectedCompetitionId: selectedCompetitionId,
          updateSelectedCompetitionId: updateSelectedCompetitionId,
        },
        secure: { ktLoginToken: ktLoginToken },
        isLoading: isLoading,
      }}
    >
      {children}
    </LocalStorage.Provider>
  );
};
