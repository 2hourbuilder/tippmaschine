import { onCall, onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import getlogintoken from "./getlogintoken";
import getseason from "./admin/addSeason";

import "dotenv/config";
import addteam from "./admin/addTeam";
admin.initializeApp();
// export const firestore = app.firestore();

export const helloworld = onRequest(async (request, response) => {
  logger.info("Hello firestore!", { structuredData: true });
  response.send("Hello Firestore!");
});

export const findcompetition = onCall(
  { region: "europe-west1" },
  async (event) => {
    const result = await axios.get("https://reqres.in/api/users/2");
    return { user: event.auth?.uid, result: result.data };
  }
);

exports.getlogintoken = getlogintoken;
exports.getseason = getseason;
exports.addteam = addteam;
