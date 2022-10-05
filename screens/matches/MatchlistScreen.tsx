import { StyledButton, StyledView } from "../../components/core";
import MatchesList from "../../components/matches/MatchesList";
import { matchesGrouped } from "../../data/dummyMatches";
import {
  addCompetition,
  getLoginToken,
  getSeason,
  updateOdds,
} from "../../firebase/functions";
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
    kurzname: "cnbbuli",
    loginToken: token.loginToken!,
  });
  alert(JSON.stringify(result));
};

const testFunctionHandler = async () => {
  const result = null;
  alert(JSON.stringify(result));
};

export default function MatchlistScreen({
  navigation,
}: NestedStackScreenProps<"MatchDetail", "MatchesTab">) {
  return (
    <StyledView px={"m"}>
      <MatchesList matchesGrouped={matchesGrouped} />
      <StyledButton label="Create Season" onPress={createSeasonHandler} />
      <StyledButton label="Get Odds" onPress={getOddsHandler} />
      <StyledButton label="Add competition" onPress={addCompetitionHandler} />
      <StyledButton label="Find lambda" onPress={testFunctionHandler} />
    </StyledView>
  );
}
