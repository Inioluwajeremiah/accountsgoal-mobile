import { Path, Polyline, Svg } from "react-native-svg";

const SaveIcon = ({ color }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      class="feather feather-save"
    >
      <Path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></Path>
      <Polyline points="17 21 17 13 7 13 7 21"></Polyline>
      <Polyline points="7 3 7 8 15 8"></Polyline>
    </Svg>
  );
};

export default SaveIcon;
