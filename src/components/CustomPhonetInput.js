import {
  Alert,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomTextRegular from "./CustomTextRegular";
import IconCaretDropdown from "../Icons/IconCaretDropdown";
import { useFonts } from "expo-font";
import { useState } from "react";
import { CountryCodes } from "../utils/CountryCodes";

const CustomPhoneInput = ({
  label,
  labelColor,
  required,
  heightC,
  selectedCode,
  onSelectCode,
  ...props
}) => {
  const [toggle, setToggle] = useState(false);
  const [countryCodes, setCountryCodes] = useState(CountryCodes);

  const [fontsLoaded] = useFonts({
    inter: require("../../assets/fonts/inter.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  const handleToggle = () => {
    setToggle(!toggle);
    // Alert.alert("", "toggle clicked");
  };

  const handleSelect = (code) => {
    // setCountries(Countries);
    onSelectCode(code);
    setToggle(!toggle);
  };

  const handleFilterCountryCodes = (value) => {
    const filteredCountryCodes = CountryCodes.filter((item) =>
      item.dial_code.toLowerCase().includes(value.trim().toLowerCase())
    );
    setCountryCodes(filteredCountryCodes);

    setToggle(toggle);
  };

  return (
    <View className=" mt-10">
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

      {/* code and number  */}
      <View className="flex flex-row items-center border border-border-color rounded-full mt-4">
        <TouchableOpacity
          className="w-[30%] pl-6 pr-3 py-3 border-r border-border-color flex flex-row justify-center items-center  "
          onPress={handleToggle}
        >
          <CustomTextRegular
            className={`${selectedCode ? "text-black" : "text-border-color"} text-xs tracking-wider mr-2 `}
          >
            {selectedCode ? selectedCode : "+1"}
          </CustomTextRegular>
          <IconCaretDropdown />
        </TouchableOpacity>

        <TextInput
          style={{ fontFamily: "inter" }}
          {...props}
          cursorColor={labelColor}
          placeholderTextColor={labelColor}
          maxLength={10}
          keyboardType={"number-pad"}
          className={`w-[70%] px-4  caret-border-color text-black text-xs  py-3`}
        />
      </View>

      {/* list country codes */}
      {toggle && (
        <View className="w-full mt-4 ">
          {/* filter code */}
          <TextInput
            style={{ fontFamily: "inter" }}
            placeholder="Filter"
            cursorColor={labelColor}
            placeholderTextColor={labelColor}
            className={` px-6 py-3 my-4  text-xs  border border-border-color`}
            onChangeText={(text) => handleFilterCountryCodes(text)}
          />
          {countryCodes.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex flex-row items-center gap-x-2 mt-4 "
              onPress={() => handleSelect(item.dial_code)}
            >
              <CustomTextRegular className="text-xs text-">
                {item.dial_code}
              </CustomTextRegular>
              <CustomTextRegular className="text-xs text-black">
                {item.code}
              </CustomTextRegular>
            </TouchableOpacity>
          ))}
          {/* <Text>{countryCodes.length}</Text> */}
        </View>
      )}
    </View>
  );
};

export default CustomPhoneInput;
