import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import getlogintoken from "./kicktipp/getlogintoken";
import getseason from "./admin/addSeason";
import "dotenv/config";
import updateoddsmonthly from "./admin/updateOdds";
import addcompetition from "./kicktipp/addcompetition";

const app = admin.initializeApp();
export const firestore = app.firestore();

export const findcompetition = onCall(
  { region: "europe-west1" },
  async (event) => {
    const result = await updateoddsmonthly();
    return JSON.stringify(result);
  }
);

exports.getlogintoken = getlogintoken;
exports.getseason = getseason;
exports.addcompetition = addcompetition;
