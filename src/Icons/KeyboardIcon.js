import { Svg, Path } from "react-native-svg";

const KeyboardIcon = ({ color }) => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M3 5H21C22.1046 5 23 5.89543 23 7V17C23 18.1046 22.1046 19 21 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5Z"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
      />
      <Path
        d="M5 9H7"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M9 9H11"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M13 9H15"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M17 9H19"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M5 13H9"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M11 13H13"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M15 13H19"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M9 17H15"
        stroke={color ? color : "#A8A8A8"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default KeyboardIcon;
