import { Text, Pressable } from "react-native";
import React from "react";

const OnboardingButton = ({ onpress }) => {
  return (
    <Pressable
      onPress={onpress}
      className=" px-6 py-3.5 rounded-[32px] bg-primary-color"
    >
      <Text className="text-white-color text-base font-semibold">
        Get Started
      </Text>
    </Pressable>
  );
};

export default OnboardingButton;
