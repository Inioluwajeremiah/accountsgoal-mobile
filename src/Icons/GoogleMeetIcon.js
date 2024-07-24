import { ClipPath, Defs, G, Path, Rect, Svg } from "react-native-svg";

const GoogleMeetIcon = () => {
  return (
    <Svg
      width="24"
      height="21"
      viewBox="0 0 24 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clip-path="url(#clip0_3303_35341)">
        <Path d="M6 0.5V6.5H0" fill="#EA4335" />
        <Path
          d="M6 0.5V6.5H14V10.6333L20 5.76667V2.5C20 1.16667 19.3333 0.5 18 0.5"
          fill="#FFBA00"
        />
        <Path
          d="M5.86621 20.5V14.5H13.9995V10.5L19.9995 15.2333V18.5C19.9995 19.8333 19.3329 20.5 17.9995 20.5"
          fill="#00AC47"
        />
        <Path d="M14 10.5L20 5.6333V15.3666" fill="#00832D" />
        <Path
          d="M20 5.63326L22.8 3.36659C23.4 2.89992 24 2.89992 24 3.83326V17.1666C24 18.0999 23.4 18.0999 22.8 17.6333L20 15.3666"
          fill="#00AC47"
        />
        <Path
          d="M0 14.3667V18.5C0 19.8334 0.666667 20.5 2 20.5H6V14.3667"
          fill="#0066DA"
        />
        <Path d="M0 6.5H6V14.5H0" fill="#2684FC" />
      </G>
      <Defs>
        <ClipPath id="clip0_3303_35341">
          <Rect
            width="24"
            height="20"
            fill="white"
            transform="translate(0 0.5)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default GoogleMeetIcon;
