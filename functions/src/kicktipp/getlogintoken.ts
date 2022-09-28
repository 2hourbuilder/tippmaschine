import { CallableRequest, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import {
  GetLoginTokenParams,
  GetLoginTokenResults,
} from "../../../functionTypes";

const getlogintoken = onCall(
  { region: "europe-west1" },
  async (request: CallableRequest<GetLoginTokenParams>) => {
    try {
      let token: string | undefined = undefined;
      await axios.postForm(
        "https://www.kicktipp.de/info/profil/loginaction",
        {
          kennung: request.data.username,
          passwort: request.data.password,
        },
        {
          headers: {
            Cookie: "kurzname=info",
          },
          beforeRedirect(options, { headers }) {
            try {
              // @ts-ignore
              const cookies = headers["set-cookie"] as string[];
              const logincookie = cookies.find((cookie) =>
                cookie.startsWith("login=")
              );
              if (typeof logincookie === "string") {
                if (logincookie.length > 1)
                  token = logincookie.substring(6, logincookie.indexOf(";"));
              }
            } catch {
              logger.log("Failed login attempts");
            }
          },
        }
      );
      return {
        loginToken: token,
      } as GetLoginTokenResults;
    } catch (error) {
      const err = error as Error;
      throw new Error(err.message);
    }
  }
);

export default getlogintoken;
