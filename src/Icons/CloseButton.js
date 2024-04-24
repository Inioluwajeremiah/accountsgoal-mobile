import { Path, Svg } from "react-native-svg";

const CloseButton = ({ color }) => {
  return (
    <Svg
      width="8"
      height="9"
      viewBox="0 0 8 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M7.11941 7.39965L1.35999 1.63965M1.3606 7.39965L7.11999 1.63965"
        stroke={color}
        stroke-width="1.44"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default CloseButton;
