import { CallableRequest, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GetMyTipsParams, GetMyTipsResults } from "../../../functionTypes";
import getmytipsformatchday from "./internal/getMyTipsForMatchday";

const getmytips = onCall(
  { region: "europe-west1" },
  async (request: CallableRequest<GetMyTipsParams>) => {
    const { kurzname, loginToken, matchdays, tippSaisonId } = request.data;
    try {
      const result = await Promise.all(
        matchdays.map(async (matchday) => {
          return {
            matchday: matchday,
            myTips: await getmytipsformatchday(
              kurzname,
              loginToken,
              matchday,
              tippSaisonId
            ),
          };
        })
      );
      return result as GetMyTipsResults;
    } catch (error) {
      const err = error as Error;
      logger.error("Error in getting tips for a user");
      throw new Error(err.message);
    }
  }
);

export default getmytips;
