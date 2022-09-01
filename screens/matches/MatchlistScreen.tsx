import { StyledButton, StyledView } from "../../components/core";
import MatchesList from "../../components/matches/MatchesList";
import { matchesGrouped } from "../../data/dummyMatches";
import {
  testFunction,
  getLoginToken,
  getSeason,
} from "../../firebase/functions";
import { NestedStackScreenProps } from "../../types";

const onPressHandler = async () => {
  try {
    const result = await getLoginToken({
      username: "christopher@schaumloeffel.de",
      password: "chrisi",
    });
    const season = await getSeason({
      kurzname: "tippmaschine-wm22",
      loginToken: result.loginToken!,
    });
    alert(JSON.stringify(season));
    //await testFunction();
  } catch (err) {
    console.log(err);
  }
};

export default function MatchlistScreen({
  navigation,
}: NestedStackScreenProps<"MatchDetail", "MatchesTab">) {
  return (
    <StyledView px={"m"}>
      <MatchesList matchesGrouped={matchesGrouped} />
      <StyledButton label="Test function" onPress={onPressHandler} />
    </StyledView>
  );
}
