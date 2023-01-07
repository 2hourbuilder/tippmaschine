import * as admin from "firebase-admin";
import getlogintoken from "./kicktipp/getlogintoken";
import addseason from "./admin/addSeason";
import "dotenv/config";
import updateodds from "./admin/updateOdds";
import addcompetition from "./kicktipp/addcompetition";
import getallcompetitions from "./kicktipp/getallcompetitions";
import getmytips from "./kicktipp/getmytips";
import submitsingletip from "./kicktipp/submitsingletip";

const app = admin.initializeApp();
export const firestore = app.firestore();

exports.getlogintoken = getlogintoken;
exports.addseason = addseason;
exports.addcompetition = addcompetition;
exports.updateodds = updateodds;
exports.getallcompetitions = getallcompetitions;
exports.getmytips = getmytips;
exports.submitsingletip = submitsingletip;
