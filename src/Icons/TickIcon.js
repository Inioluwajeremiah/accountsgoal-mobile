import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const TickIcon = () => {
  return (
    <Svg
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M1 4.5L3.5 7L9 1"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default TickIcon;
