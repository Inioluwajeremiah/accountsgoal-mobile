import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import CustomTextRegular from "./CustomTextRegular";

const LongButtonUnFixed = ({
  on_press,
  bgColor,
  textColor,
  isDisabled,
  isLoading,
  text,
  marginTop,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={{
        marginTop: marginTop,
        // marginBottom: marginTop,
        backgroundColor: isDisabled ? `#789AF3` : bgColor,
      }}
      className={`flex flex-row w-full gap-x-3  justify-center items-center h-14 rounded-full px-6 py-3 mx-auto   `}
      onPress={on_press}
    >
      {isLoading ? <ActivityIndicator size={"small"} color={`#fff`} /> : null}
      <CustomTextRegular
        style={{ color: textColor }}
        className={` font-smibold text-base`}
      >
        {text}
      </CustomTextRegular>
    </TouchableOpacity>
  );
};

export default LongButtonUnFixed;
