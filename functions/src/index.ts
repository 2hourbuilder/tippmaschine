import * as admin from "firebase-admin";
import getlogintoken from "./kicktipp/getlogintoken";
import getseason from "./admin/addSeason";
import "dotenv/config";
import updateodds from "./admin/updateOdds";
import addcompetition from "./kicktipp/addcompetition";

const app = admin.initializeApp();
export const firestore = app.firestore();

exports.getlogintoken = getlogintoken;
exports.getseason = getseason;
exports.addcompetition = addcompetition;
exports.updateodds = updateodds;
