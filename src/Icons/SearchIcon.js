import { Path, Svg } from "react-native-svg";

const SearchIcon = () => {
  return (
    <Svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M17.5 17.5L22 22"
        stroke="#A8A8A8"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
        stroke="#A8A8A8"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;
