import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const TodoListIcon = ({ color }) => {
  return (
    <Svg
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M11.5 6H21.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M11.5 12H21.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M11.5 18H21.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M3.5 7.39286C3.5 7.39286 4.5 8.04466 5 9C5 9 6.5 5.25 8.5 4"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M3.5 18.3929C3.5 18.3929 4.5 19.0447 5 20C5 20 6.5 16.25 8.5 15"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default TodoListIcon;
