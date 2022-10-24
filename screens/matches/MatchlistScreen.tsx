import { StyledButton, StyledText, StyledView } from "../../components/core";
import LoadingSpinner from "../../components/LoadingSpinner";
import MatchesList from "../../components/matches/MatchesList";
import { matchesGrouped } from "../../data/dummyMatches";
import { useMyFirestore } from "../../firebase/firestore/FirestoreContext";
import {
  addCompetition,
  getLoginToken,
  getMyTips,
  getSeason,
  updateOdds,
} from "../../firebase/functions";
import { groupMatchesByDate } from "../../helpers/functions/groupMatchesByDate";
import { useLocalStorage } from "../../localStorage/localStorageContext";
import { NestedStackScreenProps } from "../../types";

const createSeasonHandler = async () => {
  try {
    const result = await getLoginToken({
      username: "christopher@schaumloeffel.de",
      password: "chrisi",
    });
    const season = await getSeason({
      kurzname: "canadalife",
      loginToken: result.loginToken!,
      apiLeagueId: "78", // wm = 1 / buli = 78
      apiSeason: "2022",
    });

    alert(JSON.stringify(season.seasonName.de));
  } catch (err) {
    console.log(err);
  }
};

const getOddsHandler = async () => {
  try {
    const result = await updateOdds({
      fromDaysInFuture: 1,
      untilDaysInFuture: 30,
    });
    alert(JSON.stringify(result));
  } catch (err) {
    console.log(err);
  }
};

const addCompetitionHandler = async () => {
  const token = await getLoginToken({
    username: "christopher@schaumloeffel.de",
    password: "chrisi",
  });
  const result = await addCompetition({
    kurzname: "tippmaschine-wm22",
    loginToken: token.loginToken!,
  });
  alert(JSON.stringify(result));
};

const testFunctionHandler = async () => {
  const token = await getLoginToken({
    username: "christopher@schaumloeffel.de",
    password: "chrisi",
  });
  const result = await getMyTips({
    kurzname: "tippmaschine-buli22",
    loginToken: token.loginToken!,
    matchdays: [3],
    tippSaisonId: "1194753",
  });
  alert(JSON.stringify(result));
};

export default function MatchlistScreen({
  navigation,
}: NestedStackScreenProps<"MatchDetail", "MatchesTab">) {
  const storage = useLocalStorage();
  const { matchdays } = useMyFirestore();
  const newmatchesGrouped = [];

  if (matchdays.length !== 0) {
    matchdays.forEach((matchday) => {
      newmatchesGrouped.push(groupMatchesByDate(matchday.matchesShorts));
    });
  }
  return (
    <StyledView px={"m"}>
      <MatchesList matchesGrouped={matchesGrouped} />
      <StyledButton label="Create Season" onPress={createSeasonHandler} />
      <StyledButton label="Get Odds" onPress={getOddsHandler} />
      <StyledButton label="Add competition" onPress={addCompetitionHandler} />
      <StyledButton label="Get My tips" onPress={testFunctionHandler} />
      <StyledButton
        label="Reset onboarding"
        onPress={async () => storage.async.updateOnboardingStatus("first")}
      />
      <StyledText>{`Id: ${storage.async.selectedCompetitionId}`}</StyledText>
    </StyledView>
  );
}
