import { View, Text } from "react-native";
import React from "react";

const OnboardingIndicator = ({ index }) => {
  return (
    <View className="flex flex-row gap-x-4">
      {[1, 2, 3].map((item, i) => (
        <View
          key={i}
          className={`${
            index === i
              ? "w-8 h-2.5 rounded-md bg-primary-color"
              : "w-2.5 h-2.5 rounded-full bg-tertiary-accent-color"
          } `}
        ></View>
      ))}
    </View>
  );
};

export default OnboardingIndicator;
