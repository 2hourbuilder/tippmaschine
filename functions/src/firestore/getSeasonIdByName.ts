import { db } from "../util";

const getSeasonIdByName = async (nameDE: string) => {
  const snapshot = await db()
    .seasons.where("seasonName.de", "==", nameDE)
    .get();
  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  } else {
    return null;
  }
};

export default getSeasonIdByName;
