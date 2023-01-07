import { useEffect, useState } from "react";
import { SectionList, SectionListRenderItemInfo } from "react-native";
import { MatchShort } from "../../models/match";
import { MatchGroupItem } from "../../models/match";
import { StyledText, StyledView } from "../core";
import MatchCard from "./MatchCard";
import MatchGroupHeader from "./MatchGroupHeader";

const renderItem = (
  item: SectionListRenderItemInfo<MatchShort, MatchGroupItem>
) => {
  return <MatchCard matchDetails={item.item} key={item.item.matchId} />;
};

const renderSectionHeader = (section: MatchGroupItem) => {
  return <MatchGroupHeader section={section} />;
};

interface MatchesListProps {
  matchesGrouped: MatchGroupItem[];
}

const MatchesList = ({ matchesGrouped }: MatchesListProps) => {
  //const { addSnapshotListener } = useProfile();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [snapshot, setSnapshot] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  //  const listeners = [];

  // const addSnapshotData = (querySnapshot, append = true) => {
  //   const addedResults = [];
  //   const modifiedResults = [];
  //   const deletedResults = [];
  //   querySnapshot.docChanges().forEach((change) => {
  //     if (change.type === "added") {
  //       addedResults.push({
  //         ...change.doc.data(),
  //         id: change.doc.id,
  //       });
  //       if (querySnapshot.docs.length === querySnapshot.docChanges().length) {
  //         setSnapshot(querySnapshot.docs[querySnapshot.docs.length - 1]);
  //       }
  //     }
  //     if (change.type === "modified") {
  //       modifiedResults.push({ ...change.doc.data(), id: change.doc.id });
  //     }
  //     if (change.type === "removed") {
  //       deletedResults.push(change.doc.id);
  //     }
  //   });

  //   setData((prevState) => {
  //     modifiedResults.forEach((modifiedPost) => {
  //       const position = prevState.findIndex((e) => e.id === modifiedPost.id);
  //       prevState.splice(position, 1, modifiedPost);
  //     });

  //     if (append) {
  //       return [
  //         ...prevState.filter((post) => !deletedResults.includes(post.id)),
  //         ...addedResults,
  //       ];
  //     } else {
  //       return [
  //         ...addedResults,
  //         ...prevState.filter((post) => !deletedResults.includes(post.id)),
  //       ];
  //     }
  //   });
  //   setRefreshing(false);
  //   if (
  //     querySnapshot.docs.length !== querySnapshot.docChanges().length &&
  //     modifiedResults.length === 0
  //   ) {
  //     flatListRef.current.scrollToIndex({ animated: true, index: 0 });
  //   }
  // };

  // useEffect(() => {
  //   const ref = firestore.collection("posts");

  //   const setInitialListener = async () => {
  //     const initialQuery = await ref
  //       .limit(5)
  //       .orderBy("createdAt", "desc")
  //       .get();
  //     const listener = ref
  //       .orderBy("createdAt", "desc")
  //       .endAt(initialQuery.docs[initialQuery.docs.length - 1])
  //       .onSnapshot((querySnapshot) => addSnapshotData(querySnapshot, false));
  //     listeners.push(listener);
  //     addSnapshotListener(listener);
  //     setLoading(false);
  //   };
  //   setInitialListener();

  //   return () => listeners.forEach((listener) => listener());
  // }, []);

  // const getMorePosts = () => {
  //   setRefreshing(true);
  //   const listener = firestore
  //     .collection("posts")
  //     .orderBy("createdAt", "desc")
  //     .startAfter(snapshot)
  //     .limit(3)
  //     .onSnapshot((querySnapshot) => addSnapshotData(querySnapshot));
  //   listeners.push(listener);
  //   addSnapshotListener(listener);
  // };

  // if (loading) {
  //   return <ActivityIndicator />;
  // }

  return (
    <StyledView width={"100%"}>
      <SectionList
        sections={matchesGrouped}
        renderItem={(item) => renderItem(item)}
        renderSectionHeader={({ section }) => renderSectionHeader(section)}
      />
    </StyledView>
  );
};

export default MatchesList;
