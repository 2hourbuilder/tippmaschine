/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MatchShort } from "./models/match";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Login: undefined;
  Signup: undefined;
  OnboardingFirstScreen: undefined;
  OnboardingSecondScreen: undefined;
  OnboardingThirdScreen: { competitionIds: string[] } | undefined;
  OnboardingFourthScreen: undefined;
  OnboardingFifthScreen: undefined;
};

export type MatchesStackParamList = {
  Matchlist: { competitionId: string };
  MatchDetail: { matchId: string; shortData: MatchShort };
};

export type CompetitionStackParamList = {
  Competition: { competitionId: string };
  CompetitionSettings: { competitionId: string };
  AddCompetition: undefined;
};

export type ProfileStackParamList = {
  Profile: { userId: string };
  DetailSettings: { userId: string };
  ResetPassword: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
};

type NestedStackScreenParamList = MatchesStackParamList &
  CompetitionStackParamList &
  ProfileStackParamList;

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  MatchesTab: NavigatorScreenParams<MatchesStackParamList> | undefined;
  CompetitionTab: NavigatorScreenParams<CompetitionStackParamList> | undefined;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type NestedStackScreenProps<
  Screen extends keyof NestedStackScreenParamList,
  Tab extends keyof RootTabParamList
> = CompositeScreenProps<
  NativeStackScreenProps<NestedStackScreenParamList, Screen>,
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Tab>,
    NativeStackScreenProps<RootStackParamList>
  >
>;
