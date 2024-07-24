import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const MicrophoneIcon = ({ color }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M17 7V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z"
        stroke={color ? color : "#A8A8A8"}
        stroke-width="1.5"
      />
      <Path
        d="M17 7H14M17 11H14"
        stroke={color ? color : "#A8A8A8"}
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <Path
        d="M20 11C20 15.4183 16.4183 19 12 19M12 19C7.58172 19 4 15.4183 4 11M12 19V22M12 22H15M12 22H9"
        stroke={color ? color : "#A8A8A8"}
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default MicrophoneIcon;
