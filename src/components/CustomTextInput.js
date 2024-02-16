import { TextInput, View } from "react-native";
import CustomTextRegular from "./CustomTextRegular";
import { useFonts } from "expo-font";

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
    <View className="mt-6">
      {/* label */}
      <View className="flex flex-row items-top gap-x-2">
        <CustomTextRegular className="text-sm text-black">
          {label}
        </CustomTextRegular>
        {required && (
          <CustomTextRegular className="text-sm text-red-600">
            *
          </CustomTextRegular>
        )}
      </View>

      <TextInput
        {...props}
        style={{ fontFamily: "inter" }}
        cursorColor={labelColor}
        placeholderTextColor={labelColor}
        className={`border ${
          isValid ? "border-border-color" : "border-red-600"
        }  rounded-full px-6 py-3 mt-4 ${
          isValid ? "text-border-color" : "text-red-600"
        }  `}
      />
    </View>
  );
};

export default CustomTextInput;
