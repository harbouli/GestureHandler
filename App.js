import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const size = 100;
const App = () => {
  const useAnimedFollowPosition = ({x, y}) => {
    const followX = useDerivedValue(() => {
      return withSpring(x.value);
    });
    const followY = useDerivedValue(() => {
      return withSpring(y.value);
    });
    const rStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: followX.value}, {translateY: followY.value}],
      };
    });
    return {followX, followY, rStyle};
  };

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({x: 0, y: 0});

  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = {x: translateX.value, y: translateY.value};
    })
    .onUpdate(event => {
      translateX.value = event.translationX + context.value.x;
      translateY.value = event.translationY + context.value.y;
    })
    .onEnd(() => {
      translateX.value = 0;
      translateY.value = 0;
    });

  const {
    followX: blueFollowX,
    followY: blueFollowY,
    rStyle: blueCircleStyle,
  } = useAnimedFollowPosition({
    x: translateX,
    y: translateY,
  });
  const {
    followX: redFollowX,
    followY: redFollowY,
    rStyle: redCircleStyle,
  } = useAnimedFollowPosition({
    x: blueFollowX,
    y: blueFollowY,
  });
  const {
    followX: yellowFollowX,
    followY: yellowFollowY,
    rStyle: yellowCircleStyle,
  } = useAnimedFollowPosition({
    x: redFollowX,
    y: redFollowY,
  });
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.Rippel,
            {backgroundColor: 'yellow', width: size - 40, height: size - 40},
            yellowCircleStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.Rippel,
            {backgroundColor: 'red', width: size - 20, height: size - 20},
            redCircleStyle,
          ]}
        />
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.Rippel, blueCircleStyle]} />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Rippel: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: 'blue',
    aspectRatio: 1,
    position: 'absolute',
  },
});
