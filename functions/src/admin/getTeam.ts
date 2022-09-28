import { firestore } from "firebase-admin";
import { Team } from "../../../models/team";
import addTeam from "./addTeam";

const getTeam = async (name: { en: string; de: string }) => {
  let doc = null;
  const snapshotEN = await firestore()
    .collection("teams")
    .where("name.en", "==", name.en)
    .get();
  if (snapshotEN.empty) {
    const snapshotDE = await firestore()
      .collection("teams")
      .where("name.de", "==", name.de)
      .get();
    if (!snapshotDE.empty) {
      doc = snapshotDE.docs[0];
    }
  } else {
    doc = snapshotEN.docs[0];
  }
  if (doc) {
    const team: Team = {
      id: doc.id,
      apiId: doc.data().apiId,
      logoUrl: doc.data().logoUrl,
      name: doc.data().name,
    };
    return team;
  } else {
    // add team
    if (name.de === "Katar") {
      console.log(
        `Team ${name.de} / ${
          name.en
        } not created. Add now at ${new Date().toLocaleTimeString()}`
      );
    }
    const team = await addTeam(name);
    if (team) {
      return team;
    } else {
      return null;
    }
  }
};

export default getTeam;
