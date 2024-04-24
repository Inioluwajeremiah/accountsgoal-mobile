import { Path, Svg } from "react-native-svg";

const ClockIcon = ({ color }) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M10 18.3337C14.6024 18.3337 18.3334 14.6027 18.3334 10.0003C18.3334 5.39795 14.6024 1.66699 10 1.66699C5.39765 1.66699 1.66669 5.39795 1.66669 10.0003C1.66669 14.6027 5.39765 18.3337 10 18.3337Z"
        stroke={color}
        stroke-width="1.25"
      />
      <Path
        d="M10.0065 8.75635C9.3162 8.75635 8.75653 9.31601 8.75653 10.0063C8.75653 10.6967 9.3162 11.2563 10.0065 11.2563C10.6969 11.2563 11.2565 10.6967 11.2565 10.0063C11.2565 9.31601 10.6969 8.75635 10.0065 8.75635ZM10.0065 8.75635V5.83203M12.5123 12.516L10.8884 10.8922"
        stroke={color}
        stroke-width="1.25"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};

export default ClockIcon;
