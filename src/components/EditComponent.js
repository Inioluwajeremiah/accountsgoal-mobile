import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import CustomTextRegular from "./CustomTextRegular";
import { Path, Svg } from "react-native-svg";

const EditComponent = ({ color, onPressEdit }) => {
  return (
    <TouchableOpacity className="mr-4" onPress={onPressEdit}>
      <Svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M1 19H19M10.222 3.828L13.05 1L18 5.95L15.172 8.778M10.222 3.828L4.615 9.435C4.42745 9.62249 4.32206 9.87681 4.322 10.142V14.678H8.858C9.12319 14.6779 9.37751 14.5725 9.565 14.385L15.172 8.778M10.222 3.828L15.172 8.778"
          stroke={color ? color : "#4169E1"}
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
      <CustomTextRegular className="text-primary-color text-[10px] mt-2">
        Edit
      </CustomTextRegular>
    </TouchableOpacity>
  );
};

export default EditComponent;
