import { View, Text } from "react-native";
import React from "react";
import { Path, Svg } from "react-native-svg";

const AddImageLargeIcon = ({ color }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M11.508 2.99023C7.02518 2.99023 4.78379 2.99023 3.39116 4.38232C1.99854 5.77441 1.99854 8.01494 1.99854 12.496C1.99854 16.977 1.99854 19.2176 3.39116 20.6097C4.78379 22.0018 7.02518 22.0018 11.508 22.0018C15.9907 22.0018 18.2321 22.0018 19.6248 20.6097C21.0174 19.2176 21.0174 16.977 21.0174 12.496V11.9957"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M4.99854 20.9897C9.20852 16.2384 13.9397 9.93721 20.9985 14.6631"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M17.9958 1.99829V10.0064M22.0014 5.97728L13.9902 5.99217"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default AddImageLargeIcon;
