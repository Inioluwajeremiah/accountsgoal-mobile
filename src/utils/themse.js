// JavaScript version of the theme configuration
import { useFonts } from "expo-font";
import { Platform } from "react-native";

export const themeColor = "#4169E1";
export const lightThemeColor = "#f5f5f5";
// #f2f7f7"
export function getTheme() {
  const [fontsLoaded] = useFonts({
    inter: require("../../assets/fonts/inter.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  const disabledColor = "grey";

  return {
    // arrows
    arrowColor: "black",
    arrowStyle: { padding: 0 },
    // knob
    expandableKnobColor: themeColor,
    // month
    monthTextColor: "black",
    textMonthFontSize: 16,
    textMonthFontFamily: "inter",
    textMonthFontWeight: "bold",
    // day names
    textSectionTitleColor: "black",
    textDayHeaderFontSize: 12,
    textDayHeaderFontFamily: "inter",
    textDayHeaderFontWeight: "normal",
    // dates
    dayTextColor: "#000",
    todayTextColor: "#4169E1",
    textDayFontSize: 16,
    textDayFontFamily: "inter",
    textDayFontWeight: "400",
    textDayStyle: { marginTop: Platform.OS === "android" ? 2 : 4 },
    // selected date
    selectedDayBackgroundColor: themeColor,
    selectedDayTextColor: "white",
    // disabled date
    textDisabledColor: disabledColor,
    // dot (marked date)
    dotColor: themeColor,
    selectedDotColor: "white",
    disabledDotColor: disabledColor,
    dotStyle: { marginTop: -2 },
  };
}
