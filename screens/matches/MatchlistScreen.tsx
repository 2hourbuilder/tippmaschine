import { StyledButton, StyledView } from "../../components/core";
import MatchesList from "../../components/matches/MatchesList";
import { matchesGrouped } from "../../data/dummyMatches";
import {
  addCompetition,
  getLoginToken,
  getSeason,
  getOdds,
} from "../../firebase/functions";
import getMatchdayTippspielIds from "../../functions/src/kicktipp/internal/getTippspielId";
import getExpectedGoals from "../../functions/src/odds/getExpectedGoals";
import oddsToAdjProbs from "../../functions/src/odds/oddsToAdjProbs";
import {
  calculate3wayProbFromPoisson,
  calculateTeamLambdas,
} from "../../functions/src/odds/poisson";
import { NestedStackScreenProps } from "../../types";

const createSeasonHandler = async () => {
  try {
    const result = await getLoginToken({
      username: "christopher@schaumloeffel.de",
      password: "chrisi",
    });
    const season = await getSeason({
      kurzname: "tippmaschine-wm22",
      loginToken: result.loginToken!,
      apiLeagueId: "1",
      apiSeason: "2022",
    });

    alert(JSON.stringify(season.seasonName.de));
  } catch (err) {
    console.log(err);
  }
};

const getOddsHandler = async () => {
  try {
    const seasons = await getOdds(null);
    alert(JSON.stringify(seasons));
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
