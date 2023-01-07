import axios from "axios";
import { CallableRequest, onCall } from "firebase-functions/v2/https";
import { SubmitSingleTipParams } from "../../../functionTypes";

const submitsingletip = onCall(
  {
    region: "europe-west1",
  },
  async (request: CallableRequest<SubmitSingleTipParams>) => {
    const {
      kurzname,
      tippSaisonId,
      tippspielId,
      homeGoals,
      awayGoals,
      loginToken,
    } = request.data;
    try {
      await axios.postForm(
        `https://www.kicktipp.de/${kurzname}/spielinfo?tippsaisonId=${tippSaisonId}&tippspielId=${tippspielId}`,
        {
          tippAbgegeben: "true",
          heimTipp: homeGoals,
          gastTipp: awayGoals,
        },
        {
          headers: {
            Cookie: `kurzname=profil; login=${loginToken}; kt_browser_timezone=Europe%2FBerlin`,
          },
        }
      );
      return {
        message: "Abgegeben",
      };
    } catch (error) {
      const err = error as Error;
      console.log(error);
      throw new Error(err.message);
    }
  }
);

export default submitsingletip;
