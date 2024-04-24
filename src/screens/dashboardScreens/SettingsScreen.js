import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import LabelComponent from "../../components/LabelComponent";
import TextInputComponent from "../../components/TextInputComponent";
import { companySizeData, companyTypeData } from "../../utils/dummyData";
import IconCaretDropdown from "../../Icons/IconCaretDropdown";

const SettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1">
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
          Settings
        </CustomTextRegular>
        <CustomTextRegular className="text-base leading-7 mt-6 text-black text-center px-5 mb-6">
          {"How can we help you?"}
        </CustomTextRegular>

        {/* <View className="flex flex-row justify-between">
          <CustomTextRegular className="text-base leading-7 mt-6 text-black text-center px-5 mb-6">
            {"How can we help you?"}
          </CustomTextRegular>
          <TouchableOpacity className="text-primary-color text-[13px]">
            <CustomTextRegular>View all</CustomTextRegular>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;
