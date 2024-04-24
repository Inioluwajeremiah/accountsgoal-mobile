import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const SmallClockIcon = () => {
  return (
    <Svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M6 11C8.7614 11 11 8.7614 11 6C11 3.23857 8.7614 1 6 1C3.23857 1 1 3.23857 1 6C1 8.7614 3.23857 11 6 11Z"
        stroke="#474747"
      />
      <Path
        d="M6.00391 5.2541C5.58971 5.2541 5.25391 5.5899 5.25391 6.0041C5.25391 6.4183 5.58971 6.7541 6.00391 6.7541C6.41811 6.7541 6.75391 6.4183 6.75391 6.0041C6.75391 5.5899 6.41811 5.2541 6.00391 5.2541ZM6.00391 5.2541V3.49951M7.50736 7.5099L6.53306 6.5356"
        stroke="#474747"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default SmallClockIcon;
