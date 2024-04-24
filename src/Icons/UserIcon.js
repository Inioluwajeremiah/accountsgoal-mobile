import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const UserIcon = () => {
  return (
    <Svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3.83692 9.03127C3.01163 9.52267 0.847793 10.5261 2.16572 11.7817C2.80951 12.395 3.52654 12.8337 4.42801 12.8337H9.57197C10.4735 12.8337 11.1905 12.395 11.8343 11.7817C13.1522 10.5261 10.9884 9.52267 10.1631 9.03127C8.2278 7.8789 5.77219 7.8789 3.83692 9.03127Z"
        stroke="#999999"
        stroke-width="0.875"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.625 3.79199C9.625 5.24174 8.44976 6.41699 7 6.41699C5.55025 6.41699 4.375 5.24174 4.375 3.79199C4.375 2.34225 5.55025 1.16699 7 1.16699C8.44976 1.16699 9.625 2.34225 9.625 3.79199Z"
        stroke="#999999"
        stroke-width="0.875"
      />
    </Svg>
  );
};

export default UserIcon;
