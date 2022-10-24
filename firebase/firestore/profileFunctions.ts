import { User } from "firebase/auth/react-native";
import {
  setDoc,
  deleteDoc,
  doc,
  getDoc,
  arrayUnion,
  updateDoc,
  getDocs,
  query,
  collection,
  where,
} from "firebase/firestore";
import { MyCompetition } from "../../models/profile";
import { listCompetitions } from "../functions";
import { competitionsCol, profilesCol } from "./helper";

export const initializeProfile = async (
  user: User,
  username: string,
  loginToken: string,
  myCompetitions?: MyCompetition[]
) => {
  const userRef = doc(profilesCol, user.uid);
  try {
    await setDoc(userRef, {
      myCompetitions: myCompetitions ? myCompetitions : [],
      settings: { appearance: "system", language: "en-US" },
      username: username,
      loginToken: loginToken,
    });
  } catch (error) {
    throw Error("Couldn't initialize profile.");
  }
};

export const deleteProfile = async (user: User) => {
  const userRef = doc(profilesCol, user.uid);
  try {
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      await deleteDoc(userRef);
    }
  } catch (error) {
    throw Error("Error in deleting profile information.");
  }
};

export const addMyCompetitions = async (
  user: User,
  myCompetitions: MyCompetition[]
) => {
  const profileRef = doc(profilesCol, user.uid);
  try {
    await updateDoc(profileRef, {
      myCompetitions: arrayUnion(...myCompetitions),
    });
  } catch (error) {
    const e = error as Error;
    console.log(error);
    throw new Error("Error in adding MyCompetitions to Profile.", e);
  }
};

// export const createMyCompetitions = async(loginToken:string) => {
//   const {kurznamen} = await listCompetitions({loginToken:loginToken})
//   const competitions = await getDocs(query(competitionsCol,where("kurzname","in",kurznamen.slice(0,9))))
//         const mycompetitions:MyCompetition[] = kurznamen.map(kurzname=>{
//           //const competitionDoc = competitions.docs.find(doc => doc.data().kurzname === kurzname)

//           const mycomp:MyCompetition ={
//             automationEnabled:false,
//             competitionId: null,
//             isActive: false,
//             myTips: [],
//             name: kurzname,
//             kurzname: kurzname
//             playerName: "Max"
//           })
//           }
//         })
// }
