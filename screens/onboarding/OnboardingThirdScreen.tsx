import { MaterialIcons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import _ from "lodash";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import {
  StyledButton,
  StyledText,
  StyledTouchable,
  StyledView,
} from "../../components/core";
import StepsBar from "../../components/general/StepsBar";
import { useUser } from "../../firebase/auth/AuthContext";
import {
  competitionsCol,
  matchdaysCol,
  profilesCol,
} from "../../firebase/firestore/helper";
import { addMyCompetitions } from "../../firebase/firestore/profileFunctions";
import {
  addCompetition,
  getMyTips,
  listCompetitions,
} from "../../firebase/functions";
import { useLocalStorage } from "../../localStorage/localStorageContext";
import { MyCompetition } from "../../models/profile";

import { RootStackScreenProps } from "../../types";
// onPress={onPressHandler(kurzname)}>
const SelectCompetitionRow = ({
  kurzname,
  name,
  isChecked,
  onPressHandler,
}: {
  kurzname: string;
  name: string;
  isChecked: boolean;
  onPressHandler: (kurzname: string) => void;
}) => {
  return (
    <StyledTouchable
      width={"90%"}
      p="m"
      my="xs"
      mx="l"
      bg="accentTertiary"
      overflow={"hidden"}
      borderRadius={"l"}
      flexDirection="row"
      onPress={() => onPressHandler(kurzname)}
    >
      <StyledView flexGrow={1}>
        <StyledText color={"textPrimary"}>{name}</StyledText>
      </StyledView>
      <StyledView flexGrow={0} justifyContent={"center"} alignItems="center">
        {isChecked ? (
          <MaterialIcons name="check" size={24} color="white" />
        ) : null}
      </StyledView>
    </StyledTouchable>
  );
};

export default function OnboardingThirdScreen({
  route,
  navigation,
}: RootStackScreenProps<"OnboardingThirdScreen">) {
  const [competitions, setCompetitions] =
    useState<{ kurzname: string; name: string; isChecked: boolean }[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { profile, user } = useUser();
  const { async } = useLocalStorage();

  useEffect(() => {
    const loadCompetitions = async () => {
      const result = await listCompetitions({
        loginToken: profile!.loginToken!,
      });
      if (result) {
        setCompetitions(
          result.map((r) => {
            return {
              kurzname: r.kurzname,
              name: r.name,
              isChecked: true,
            };
          })
        );
      }
      setIsLoading(false);
    };
    loadCompetitions();
  }, []);

  const onPressHandler = (kurzname: string) => {
    const copy = _.cloneDeep(competitions);
    if (copy) {
      const index = copy.findIndex((c) => c.kurzname === kurzname);
      copy[index].isChecked = !copy[index].isChecked;
      setCompetitions(copy);
    }
  };

  const onSubmitHandler = async () => {
    setIsLoading(true);
    if (user && competitions && profile) {
      const competitionsToAdd = competitions.filter(
        (c) => c.isChecked === true
      );
      const newMycompetitions: MyCompetition[] = [];

      await Promise.all(
        competitionsToAdd.map(async (competition) => {
          const exists = profile.myCompetitions.find(
            (c) => c.kurzname === competition.kurzname
          );
          if (exists) return null;
          const search = await getDocs(
            query(
              competitionsCol,
              where("kurzname", "==", competition.kurzname)
            )
          );
          if (!search.empty && profile.loginToken) {
            const upcomingMatchdays = await getDocs(
              query(
                matchdaysCol(search.docs[0].id),
                where("complete", "==", false)
              )
            );
            const matchdayNumbers = upcomingMatchdays.docs.map(
              (doc) => doc.data().index
            );
            const currentTips = await getMyTips({
              kurzname: competition.kurzname,
              loginToken: profile.loginToken,
              matchdays: matchdayNumbers,
              tippSaisonId: search.docs[0].data().tippsaisonId,
            });
            newMycompetitions.push({
              automationEnabled: false,
              competitionId: search.docs[0].id,
              isActive: true,
              kurzname: competition.kurzname,
              myTips: currentTips,
              name: competition.name,
              playerName: "Tester",
            });
          } else {
            if (profile.loginToken) {
              const newCompetition = await addCompetition({
                kurzname: competition.kurzname,
                loginToken: profile.loginToken,
              });
              const upcomingMatchdays = await getDocs(
                query(
                  matchdaysCol(newCompetition.competitionId),
                  where("complete", "==", false)
                )
              );
              const matchdayNumbers = upcomingMatchdays.docs.map(
                (doc) => doc.data().index
              );
              const currentTips = await getMyTips({
                kurzname: competition.kurzname,
                loginToken: profile.loginToken,
                matchdays: matchdayNumbers,
                tippSaisonId: newCompetition.tippsaisonId,
              });
              newMycompetitions.push({
                automationEnabled: false,
                competitionId: newCompetition.competitionId,
                isActive: true,
                kurzname: competition.kurzname,
                myTips: currentTips,
                name: competition.name,
                playerName: "Tester",
              });
            }
          }
        })
      );
      await addMyCompetitions(user, newMycompetitions);

      if (newMycompetitions.length > 0) {
        if (typeof newMycompetitions[0].competitionId === "string") {
          await async.updateSelectedCompetitionId(
            newMycompetitions[0].competitionId
          );
        }
      }
    }
    navigation.navigate("OnboardingFourthScreen");
    setIsLoading(false);
  };

  return (
    <StyledView
      height={"100%"}
      backgroundColor="accentSecondary"
      alignItems={"center"}
    >
      <StyledView
        alignItems={"center"}
        height={"15%"}
        justifyContent="center"
        pt={"l"}
        mt="xl"
      >
        <StepsBar currentStep={3} totalSteps={4} />
      </StyledView>
      <StyledText color={"textOnColor"} textAlign="center">
        Für welche Tipprunden willst du die Tippmaschine nutzen?
      </StyledText>
      <StyledView width={"90%"}>
        {isLoading ? (
          <StyledText>Tipprunden laden...</StyledText>
        ) : competitions ? (
          <StyledView>
            <ScrollView>
              {competitions.map((c) => {
                return (
                  <SelectCompetitionRow
                    key={c.kurzname}
                    kurzname={c.kurzname}
                    name={c.name}
                    isChecked={c.isChecked}
                    onPressHandler={onPressHandler}
                  />
                );
              })}
            </ScrollView>
          </StyledView>
        ) : (
          <StyledText>Keine Tipprunden gefunden</StyledText>
        )}
      </StyledView>

      <StyledButton
        onPress={onSubmitHandler}
        label="Weiter"
        width={"60%"}
        borderRadius="l"
        p="m"
        alignItems={"center"}
        justifyContent="center"
        mt={"l"}
      />
    </StyledView>
  );
}
