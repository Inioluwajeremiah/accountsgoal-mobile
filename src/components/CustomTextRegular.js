import { useFonts } from "expo-font";
import React from "react";
import { Text } from "react-native";

const CustomTextRegular = (props) => {
  const [fontsLoaded] = useFonts({
    inter: require("../../assets/fonts/inter.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Text {...props} style={[props.style, { fontFamily: "inter" }]}></Text>
  );
};

export default CustomTextRegular;
