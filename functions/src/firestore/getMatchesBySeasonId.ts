import { firestore } from "firebase-admin";
import { Match } from "../../../models/match";
import { db } from "../util";

const getMatchesBySeasonId = async (seasonId: string) => {
  const snapshots = await db().matches(seasonId).get();
  if (!snapshots.empty) {
    const matches = snapshots.docs.map((doc) => {
      const kickoffTimestamp = doc.data().kickoff as unknown;
      const kickoff = kickoffTimestamp as firestore.Timestamp;
      return {
        ...doc.data(),
        kickoff: kickoff.toDate(),
        id: doc.id,
      } as Match;
    });
    return matches;
  } else {
    return null;
  }
};

export default getMatchesBySeasonId;
