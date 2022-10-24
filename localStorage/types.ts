// AsyncStorage

export type AsyncStorageFields = "onboardingStatus" | "selectedCompetitionId";
export type OnboardingStatusValues = "completed" | "first";

// SecureStore

// Complete interfaces

export interface SecureStorageSchema {
  ktLoginToken: string | null;
}

export interface AsyncStorageSchema {
  onboardingStatus: string | null;
  updateOnboardingStatus: (value: OnboardingStatusValues) => Promise<void>;
  selectedCompetitionId: string | null;
  updateSelectedCompetitionId: (id: string) => Promise<void>;
}

export interface LocalStorageSchema {
  secure: SecureStorageSchema;
  async: AsyncStorageSchema;
  isLoading: boolean;
}
