import { View, Text, Modal, ScrollView, Pressable } from "react-native";
import React from "react";
import CustomTextRegular from "../../../components/CustomTextRegular";
import UserIcon from "../../../Icons/UserIcon";
import EmailIcon from "../../../Icons/EmailIcon";
import DobIcon from "../../../Icons/DobIcon";
import PhoneBookIcon from "../../../Icons/PhoneBookIcon";

const MapContactModal = ({
  showContactModal,
  handleToggleContactModal,
  currentItem,
}) => {
  return (
    <View>
      <Modal transparent={true} visible={showContactModal} animationType="none">
        <View
          // style={{ marginTop: StatusBarHeight }}
          className="h-full w-full bg-black/50 "
        >
          <Pressable className="h-[50%] " onPress={handleToggleContactModal} />

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            className="px-5  w-full h-[55%] flex flex-col  rounded-t-3xl  bg-screen-bg"
          >
            <View className="py-6 ">
              <CustomTextRegular className="font-black leading-6 text-base text-black mb-6">
                {"Contact Information"}
              </CustomTextRegular>

              {/* list of contact details  */}

              <View className="w-full  flex flex-row items-center  mt-4">
                {/*  icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <UserIcon color={"#4169E1"} />
                </View>
                <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                  {currentItem.ACCOUNT_NAME}
                </CustomTextRegular>
              </View>
              <View className="w-full  flex flex-row items-center  mt-4">
                {/*  icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <EmailIcon color={"#4169E1"} />
                </View>
                <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                  {"baylor@irving.com Scott@irving.com"}
                </CustomTextRegular>
              </View>
              <View className="w-full  flex flex-row items-center  mt-4">
                {/*  icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <DobIcon color={"#4169E1"} />
                </View>
                <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                  {"20 December 2001"}
                </CustomTextRegular>
              </View>
              <View className="w-full  flex flex-row items-center  mt-4">
                {/*  icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <PhoneBookIcon color={"#4169E1"} />
                </View>
                <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                  {"Baylor- +16212233242"}
                </CustomTextRegular>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default MapContactModal;
