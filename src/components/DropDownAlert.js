import { View, Text, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import CustomTextRegular from "./CustomTextRegular";

const DropDownAlert = ({ showAlertModal, message, type, ToggleAlertModal }) => {
  const [toggleAlert, setToggleAlert] = useState(true);
  const handleToggleAlert = () => {
    setToggleAlert(false);
  };

  return (
    <Modal visible={toggleAlert} transparent={true} animationType="fade">
      <View className="h-full w-full">
        <View
          className={`top-0 w-full  ${
            type === "success"
              ? "bg-[#6CBE44]"
              : type === "warn"
                ? "bg-orange-500"
                : type === "danger"
                  ? "bg-red-500"
                  : ""
          } h-[10%] flex items-center justify-center`}
        >
          <CustomTextRegular className="text-white text-base font-semibold text-center">
            {message}
          </CustomTextRegular>
        </View>
        <Pressable className="h-[90%]" onPress={handleToggleAlert} />
      </View>
    </Modal>
  );
};

export default DropDownAlert;
