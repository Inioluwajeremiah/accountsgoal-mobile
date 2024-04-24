import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import icon from "../../../assets/icon.png";
import { chatData } from "../../utils/dummyData";

const SupportChatScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* back icon */}

      <ScrollView
        className="flex-1  px-5 "
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* header */}
        <View className="flex flex-row items-center mt-10">
          <TouchableOpacity
            className=" mr-5"
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>

          <CustomTextRegular className="text-2xl font-bold  ">
            Support
          </CustomTextRegular>
        </View>

        {chatData.map((item, index) =>
          item.user === "admin" ? (
            <View className="relative w-[90%] mt-10 flex self-start flex-row items-baseline justify-between  pb-8  ">
              {/* image icon */}

              <View className="absolute bottom-8 left-0 h-14 w-14 rounded-full bg-[#A8BAF1] flex items-center justify-center">
                <Image source={icon} className="h-10 w-6 object-contain  " />
              </View>

              <CustomTextRegular
                className={`text-sm w-[80%] ml-20 bg-tertiary-accent-color p-4 rounded-r-3xl rounded-tl-3xl leading-6`}
              >
                {item.message}
              </CustomTextRegular>
              <CustomTextRegular className="absolute bottom-0 left-20 text-[#757575] text-xs w-full">
                {item.time}
              </CustomTextRegular>
            </View>
          ) : (
            <View className="relative w-[80%] flex self-end mt-6  pb-8  ">
              <CustomTextRegular className="text-sm text-end text-[#DF1525]  bg-[#FFECEF] p-4 rounded-l-3xl rounded-tr-3xl leading-6">
                {item.message}
              </CustomTextRegular>
              <CustomTextRegular className="absolute bottom-0 left-1 text-[#757575] text-xs w-full">
                {item.time}
              </CustomTextRegular>
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SupportChatScreen;
