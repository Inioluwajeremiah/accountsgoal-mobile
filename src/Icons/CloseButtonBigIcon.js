import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const CloseButtonBigIcon = () => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/Svg"
    >
      <Path
        d="M19 5L5 19M5 5L19 19"
        stroke="#A8A8A8"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CloseButtonBigIcon;
