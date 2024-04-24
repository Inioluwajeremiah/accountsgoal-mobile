import { useFonts } from "expo-font";
import { TextInput } from "react-native";

const CustomTextInputField = ({ style, ...props }) => {
  const [fontsLoaded] = useFonts({
    inter: require("../../assets/fonts/inter.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return <TextInput {...props} style={[{ fontFamily: "inter" }, style]} />;
};

export default CustomTextInputField;
