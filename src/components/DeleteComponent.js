import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import CustomTextRegular from "./CustomTextRegular";
import { Path, Svg } from "react-native-svg";

const DeleteComponent = ({ onPressDelete }) => {
  return (
    <TouchableOpacity onPress={onPressDelete}>
      <Svg
        width="25"
        height="24"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M20 5.5L19.3803 15.5251C19.2219 18.0864 19.1428 19.3671 18.5008 20.2879C18.1833 20.7431 17.7747 21.1273 17.3007 21.416C16.3421 22 15.059 22 12.4927 22C9.92312 22 8.6383 22 7.67905 21.4149C7.2048 21.1257 6.796 20.7408 6.47868 20.2848C5.83688 19.3626 5.75945 18.0801 5.60461 15.5152L5 5.5"
          stroke="#F13535"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <Path
          d="M3.5 5.5H21.5M16.5557 5.5L15.8731 4.09173C15.4196 3.15626 15.1928 2.68852 14.8017 2.39681C14.715 2.3321 14.6231 2.27454 14.527 2.2247C14.0939 2 13.5741 2 12.5345 2C11.4688 2 10.936 2 10.4957 2.23412C10.3981 2.28601 10.305 2.3459 10.2173 2.41317C9.82164 2.7167 9.60063 3.20155 9.15861 4.17126L8.55292 5.5"
          stroke="#F13535"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <Path
          d="M10 16.5V10.5"
          stroke="#F13535"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <Path
          d="M15 16.5V10.5"
          stroke="#F13535"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </Svg>

      <CustomTextRegular className="text-high-priority text-[10px] mt-2">
        Delete
      </CustomTextRegular>
    </TouchableOpacity>
  );
};

export default DeleteComponent;
