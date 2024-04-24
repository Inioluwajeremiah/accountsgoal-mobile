import { View } from "react-native";
import React from "react";
import CustomTextRegular from "./CustomTextRegular";

const LabelComponent = ({ label, required }) => {
  return (
    <View className="flex flex-row items-top gap-x-2 mt-10">
      <CustomTextRegular className="text-sm text-black">
        {label}
      </CustomTextRegular>
      {required && (
        <CustomTextRegular className="text-sm text-red-600">
          *
        </CustomTextRegular>
      )}
    </View>
  );
};

export default LabelComponent;
