import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";
import LabelComponent from "./LabelComponent";
import EyeClose from "../Icons/EyeClose";
import EyeOpen from "../Icons/EyeOpen";

const PasswordFIeld = ({
  label,
  labelColor,
  showVisibility,
  required,
  isValid,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const [fontsLoaded] = useFonts({
    inter: require("../../assets/fonts/inter.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="bg-transparent">
      <LabelComponent label={label} required={required} />
      <View
        className={`h-12 flex flex-row  items-center w-full border-solid  rounded-full mt-4 mb-5 px-2 ${
          isValid ? "border border-border-color" : "border border-red-600"
        } 
        `}
      >
        <TextInput
          {...props}
          cursorColor={labelColor}
          placeholderTextColor={labelColor}
          secureTextEntry={secureTextEntry}
          className={`text-xs w-full h-full px-6 py-3 `}
          style={{
            fontFamily: "inter",
          }}
        />
        {showVisibility && (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={{ padding: 10 }}
            className="absolute right-1"
          >
            {secureTextEntry ? <EyeClose /> : <EyeOpen />}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const PasswordFieldStyle = StyleSheet.create({
  container: {
    backgroundColor: "#e8eceb",
    borderRadius: 10,
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default PasswordFIeld;
