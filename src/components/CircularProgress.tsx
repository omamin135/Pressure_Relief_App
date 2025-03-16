import React, { useEffect, useRef } from "react";
import { View, Animated, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressProps {
  progress: number; // Value between 0 and 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  children?: JSX.Element;
}

const CircularProgress = ({
  progress,
  size = 100,
  strokeWidth = 10,
  color = "blue",
  backgroundColor = "lightgray",
  disabled = false,
  children,
}: CircularProgressProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500, // Animation speed
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0], // Full circle to empty
  });

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          opacity={disabled ? 0.4 : 1}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{ position: "absolute" }}>{children}</View>
    </View>
  );
};

// Fix for Animated Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default CircularProgress;
