import { View, Modal, Pressable, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomTextRegular from "../../components/CustomTextRegular";
import TeamsIcon from "../../Icons/TeamsIcon";

const CalendarNewScreen = () => {
  const [toggleCalendarDialog, setToggleCalendarDialog] = useState(false);

  // toggle media dialog
  const handleToggleCalendarDialog = () => {
    setToggleCalendarDialog(!toggleCalendarDialog);
  };
  return (
    <Modal
      animationType="slide"
      visible={toggleCalendarDialog}
      transparent={true}
    >
      <View className="flex-1 flex flex-col justify-between">
        <Pressable className="h-[65%]" />
        <View className=" w-full h-[45%] justify-center items-center bg-screen-bg rounded-t-3xl px-5 -mt-16">
          <TouchableOpacity>
            <TeamsIcon />
            <CustomTextRegular className="text-sm">Teams</CustomTextRegular>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarNewScreen;
