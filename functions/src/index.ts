import * as admin from "firebase-admin";
import getlogintoken from "./kicktipp/getlogintoken";
import addseason from "./admin/addSeason";
import "dotenv/config";
import { updateOddsOnCall, updateOddsOnSchedule } from "./admin/updateOdds";
import addcompetition from "./kicktipp/addcompetition";
import getallcompetitions from "./kicktipp/getallcompetitions";
import getmytips from "./kicktipp/getmytips";
import submitsingletip from "./kicktipp/submitsingletip";
import { setGlobalOptions } from "firebase-functions/v2";
import {
  updateAllCompetitionOnSchedule,
  updateCompetitionOnCall,
} from "./admin/updateCompetition";
import {
  updateScoresOnCall,
  updateScoresOnSchedule,
} from "./admin/updateScores";

const app = admin.initializeApp();
export const firestore = app.firestore();

setGlobalOptions({ region: "europe-west1" });

exports.getlogintoken = getlogintoken;
exports.addseason = addseason;
exports.addcompetition = addcompetition;
exports.updateoddsoncall = updateOddsOnCall;
exports.updateoddsonschedule = updateOddsOnSchedule;
exports.getallcompetitions = getallcompetitions;
exports.getmytips = getmytips;
exports.submitsingletip = submitsingletip;
exports.updatecompetition = updateCompetitionOnCall;
exports.updatecompetitiononschedule = updateAllCompetitionOnSchedule;
exports.updatescoresoncall = updateScoresOnCall;
exports.updatescoresonschedule = updateScoresOnSchedule;
