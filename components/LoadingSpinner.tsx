import React, { useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  cancelAnimation,
  withTiming,
  Easing,
  withRepeat,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import { StyledView } from "./core";

const LoadingSpinner = () => {
  const animation = useSharedValue(0);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: animation.value + "deg",
        },
      ],
    };
  });
  const startAnimation = () => {
    animation.value = withRepeat(
      withTiming(90, {
        duration: 400,
        easing: Easing.linear,
      }),
      100
    );
  };
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={startAnimation}>
        <Animated.View style={[styles.box, animationStyle]}>
          <Image
            source={require("../assets/images/cog.png")}
            width={100}
            height={100}
            resizeMode="center"
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );

  //   return (
  //     <StyledView width={100} height={100}>

  //     </StyledView>
  //   );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 200,
    height: 200,
  },
});

export default LoadingSpinner;
