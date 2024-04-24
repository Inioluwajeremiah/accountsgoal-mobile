import { TextInput, View } from "react-native";
import { useFonts } from "expo-font";
import LabelComponent from "./LabelComponent";

const CustomTextInput = ({
  label,
  labelColor,
  required,
  isValid,
  heightC,
  ...props
}) => {
  const [fontsLoaded] = useFonts({
    inter: require("../../assets/fonts/inter.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <View className="">
      {/* label */}

      <LabelComponent label={label} required={required} />
      <TextInput
        {...props}
        style={{ fontFamily: "inter" }}
        cursorColor={labelColor}
        placeholderTextColor={labelColor}
        className={`border text-xs ${
          isValid ? "border-border-color" : "border-red-600"
        }  rounded-full px-6 py-3 mt-4 
       
        `}
      />
      {/* ${
          isValid ? "text-border-color" : "text-red-600"
        }   */}
    </View>
  );
};

export default CustomTextInput;
