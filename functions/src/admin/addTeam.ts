import { HttpsError } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { firestore } from "firebase-admin";
import { Team } from "../../../models/team";
import listTeamsAPI from "../api-football/teams";
import * as stringSimilarity from "string-similarity";

const addTeam = async (name: { en: string; de: string }) => {
  const writeToFirestore = async (team: Team) => {
    const { logoUrl, name, apiId } = team;
    try {
      const ref = await firestore().collection("teams").add({
        logoUrl: logoUrl,
        apiId: apiId,
        name: name,
      });
      return ref.id;
    } catch (error) {
      logger.error("Could not add team to Firestore", error);
      throw new HttpsError(
        "internal",
        "Could not add team to Firestore",
        error
      );
    }
  };

  const createTeam = async () => {
    const teams = await listTeamsAPI("1", "2022");
    const matches = stringSimilarity.findBestMatch(
      name.en,
      teams.map((team) => team.name)
    );
    console.log(matches);
    const bestmatch = teams[matches.bestMatchIndex];
    if (matches.bestMatch.rating > 0.8) {
      const team: Team = {
        id: null,
        apiId: bestmatch.id,
        name: name,
        logoUrl: bestmatch.logo,
      };
      return team;
    } else {
      return null;
    }
  };
  const team = await createTeam();
  if (team) {
    const id = await writeToFirestore(team);
    team.id = id;
  } else {
    return null;
  }
  return team;
};

export default addTeam;
