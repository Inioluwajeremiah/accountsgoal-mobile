import { Alert, Pressable, TextInput, View } from "react-native";
import CustomTextRegular from "./CustomTextRegular";
import IconCaretDropdown from "../Icons/IconCaretDropdown";
import CountryCodes from "../../assets/CountryCodes.json";
import { useFonts } from "expo-font";
import { useState } from "react";

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
    Alert.alert("", "toggle clicked");
  };

  const handleSelect = (code) => {
    // setCountries(Countries);
    onSelectCode(code);
    setToggle(false);
  };

  const handleFilterCountryCodes = (value) => {
    const filteredCountryCodes = CountryCodes.filter((item) =>
      item.name.toLowerCase().includes(value.trim().toLowerCase())
    );
    setCountryCodes(filteredCountryCodes);

    setToggle(toggle);
  };

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

      <View className="flex flex-row items-center border border-border-color rounded-full mt-4">
        <Pressable
          className="w-[30%] pl-6 pr-3 py-3 border-r border-border-color flex flex-row justify-center items-center  "
          onPress={handleToggle}
        >
          <CustomTextRegular className="text-border-color text-xs tracking-wider mr-2 ">
            {selectedCode ? selectedCode : "+1"}
          </CustomTextRegular>
          <IconCaretDropdown />
        </Pressable>

        <TextInput
          style={{ fontFamily: "inter" }}
          {...props}
          cursorColor={labelColor}
          placeholderTextColor={labelColor}
          className={`w-[70%] px-4  caret-border-color text-border-color placeholder-border-color py-3`}
        />
      </View>

      {/* list country codes */}
      {toggle ? (
        <View className=" bg-tertiary-color rounded-md -mt-3 mb-3 ">
          <TextInput
            style={{ fontFamily: "inter" }}
            placeholder="Filter"
            cursorColor={labelColor}
            placeholderTextColor={labelColor}
            // className={`w-full p-3  text-secondary-color text-sm ${
            //   countries.length > 0
            //     ? "border-b border-b-border-color"
            //     : "rounded-md"
            // } bg-tertiary-color rounded-t-md `}
            className={` px-6 py-3 mt-4 `}
            onChangeText={(text) => handleFilterCountryCodes(text)}
          />
          {countryCodes.map((item, index) => (
            <Pressable
              key={index}
              className="flex flex-row items-center gap-x-2"
              onPress={handleSelect(item.dial_code)}
            >
              <CustomTextRegular className="text-xs text-black">
                {item.dial_code}
              </CustomTextRegular>
              <CustomTextRegular className="text-xs text-black">
                {item.code}
              </CustomTextRegular>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export default CustomPhoneInput;
