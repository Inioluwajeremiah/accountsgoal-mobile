import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const CalendarSmall = () => {
  return (
    <Svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M10.5 1.16699V2.33366M3.5 1.16699V2.33366"
        stroke="#999999"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M5.83333 9.91634L5.83333 7.78554C5.83333 7.67372 5.75356 7.58301 5.65517 7.58301H5.25M7.95066 9.91634L8.74078 7.78671C8.77771 7.68713 8.69913 7.58301 8.58708 7.58301H7.58333"
        stroke="#999999"
        stroke-linecap="round"
      />
      <Path
        d="M1.45833 7.14187C1.45833 4.60013 1.45833 3.32925 2.18874 2.53962C2.91914 1.75 4.0947 1.75 6.44583 1.75H7.55417C9.90529 1.75 11.0809 1.75 11.8113 2.53962C12.5417 3.32925 12.5417 4.60013 12.5417 7.14187V7.44147C12.5417 9.98322 12.5417 11.2541 11.8113 12.0437C11.0809 12.8333 9.90529 12.8333 7.55417 12.8333H6.44583C4.0947 12.8333 2.91914 12.8333 2.18874 12.0437C1.45833 11.2541 1.45833 9.98322 1.45833 7.44147V7.14187Z"
        stroke="#999999"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M3.5 4.66699H10.5"
        stroke="#999999"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default CalendarSmall;
