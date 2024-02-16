import { SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import CustomTextRegular from "./CustomTextRegular";
import LongButtonUnFixed from "./LongButtonUnFixed";

const SuccessAlertScreenComponent = ({
  title1,
  title2,
  subtitle1,
  subtitle2,
  btntext,
  on_press,
  src,
}) => {
  return (
    <SafeAreaView className="flex-1 justify-center items-center  bg-white px-5">
      <LottieView className="w-32 h-32" source={src} autoPlay loop={false} />
      {/* title 1 */}
      <CustomTextRegular className=" text-center text-black text-2xl font-bold leading-9">
        {title1}
      </CustomTextRegular>
      {/* title 2 */}
      {title2 ? (
        <CustomTextRegular className=" text-center text-black text-2xl font-bold mb-2">
          {title2}
        </CustomTextRegular>
      ) : null}
      {/* subtitle 1 */}
      <CustomTextRegular className=" text-center text-primary-accent-color text-sm  leading-6 mt-4">
        {subtitle1}
      </CustomTextRegular>
      {/* subtitle 2 */}
      {subtitle2 ? (
        <CustomTextRegular className=" text-center text-primary-accent-color text-sm mb-2">
          {subtitle2}
        </CustomTextRegular>
      ) : null}
      {/* <LongButtonUnFixed
        text={`${btntext}`}
        textColor={"white"}
        bgColor={"#00CB65"}
        on_press={on_press}
      /> */}
    </SafeAreaView>
  );
};

export default SuccessAlertScreenComponent;
