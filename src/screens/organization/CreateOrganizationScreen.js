import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import React, { useState } from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import LabelComponent from "../../components/LabelComponent";
import TextInputComponent from "../../components/TextInputComponent";
import { customButtonWithIcon } from "../../utils/stylesVariable";
import IconCaretDropdown from "../../Icons/IconCaretDropdown";
import { useCreateGoalMutation } from "../../slices/goalApiSlice";
import { companySizeData, companyTypeData } from "../../utils/dummyData";
import { status_bar_height } from "../../utils/Dimensions";

const CreateOrganizationScreen = ({ navigation }) => {
  const [toggleCompanyType, setToggleCompanyType] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [companySize, setCompanySize] = useState("");

  const isValidForm = !companyName || !companyType;

  const handleToggleCompanyType = () => {
    setToggleCompanyType(!toggleCompanyType);
  };

  const handleSelectCompanyType = (value) => {
    setCompanyType(value);
    handleToggleCompanyType();
  };

  const handleSelectCompanySize = (value) => {
    setCompanySize(value);
  };

  const handleNextButton = async () => {
    const body = {
      companyName,
      companyType,
      companySize,
    };
    navigation.navigate("inviteOthers", body);
  };
  return (
    <SafeAreaView
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      {/* back icon */}

      <ScrollView
        className="flex-1 px-5 "
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* <View className="border"> */}
        <TouchableOpacity
          className="mt-5 -ml-2"
          onPress={() => navigation.goBack()}
        >
          <BackIcon />
        </TouchableOpacity>
        {/* header */}
        <CustomTextRegular className="text-2xl font-bold text-center mt-8 ">
          Create Organisation
        </CustomTextRegular>
        <CustomTextRegular className="text-sm leading-7 mt-6 text-[#5C5C5C] text-center px-5 mb-6">
          {
            " it's your first step towards streamlined  management and enhanced productivity."
          }
        </CustomTextRegular>

        <LabelComponent label={"Company Name"} required={true} />
        <TextInputComponent
          placeholder="Company name"
          labelColor={"#B9B9B9"}
          onChangeText={(e) => setCompanyName(e)}
        />
        <LabelComponent label={"Company Size"} required={false} />
        <View className="flex flex-row flex-wrap gap-4 mt-2 ">
          {companySizeData.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`border ${
                companySize === item ? "border-black" : "border-form-text-color"
              } rounded-3xl p-3`}
              onPress={() => handleSelectCompanySize(item)}
            >
              <CustomTextRegular className=" text-center ">
                {item}
              </CustomTextRegular>
            </TouchableOpacity>
          ))}
        </View>

        {/* company type */}
        <LabelComponent label={"Company Type"} required={true} />
        <Pressable
          className={customButtonWithIcon + " justify-between"}
          onPress={handleToggleCompanyType}
        >
          <CustomTextRegular className=" text-sm text-black">
            {companyType}
          </CustomTextRegular>
          <IconCaretDropdown />
        </Pressable>
        {/* company type drop down */}
        {toggleCompanyType && (
          <View className="w-full bg-white rounded-lg my-2 p-3 ">
            {companyTypeData.map((item, index) => (
              <Pressable
                onPress={() => handleSelectCompanyType(item)}
                className={`${
                  index === companyTypeData.length - 1
                    ? "border-none"
                    : "border-b-[0.7px] border-b-form-text-color"
                }`}
                key={index}
              >
                <CustomTextRegular
                  className={` py-3 ${
                    companyType === item ? "text-black" : "text-form-text-color"
                  }`}
                >
                  {item}
                </CustomTextRegular>
              </Pressable>
            ))}
          </View>
        )}

        {/* next button */}
        <TouchableOpacity
          className={`${
            !isValidForm ? "bg-primary-color" : "bg-[#6787e7]"
          } rounded-full mt-16 h-12 py-3 flx justify-center items-center mb-10`}
          disabled={isValidForm ? true : false}
          onPress={handleNextButton}
        >
          <CustomTextRegular className="text-center font-semibold text-white text-base">
            Next
          </CustomTextRegular>
        </TouchableOpacity>
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateOrganizationScreen;
