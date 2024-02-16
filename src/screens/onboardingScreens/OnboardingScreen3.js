import { View, Text, SafeAreaView, Image, Pressable } from "react-native";
import React from "react";
import OnboardingIndicator from "../../components/OnboardingIndicator";
import CustomTextRegular from "../../components/CustomTextRegular";
import onboarding3 from "../../../assets/onboarding3.png";
import OnboardingButton from "../../components/OnboardingButton";
import { useDispatch } from "react-redux";
import { setOnboardingData } from "../../slices/onbardingSlice";

const OnboardingScreen3 = ({ navigation }) => {
  const dispatch = useDispatch();
  // handle onboarding
  const handleOnboarding = () => {
    dispatch(setOnboardingData({ onboarding: true }));
    navigation.navigate("signup");
  };
  return (
    <SafeAreaView className="flex-1 bg-onboard-bg">
      <CustomTextRegular className="text-black-color mt-10 font-black text-3xl mx-4 text-left leading-[45px]">
        Smart Scheduling{"\n"} with AI.
      </CustomTextRegular>
      <Image
        source={onboarding3}
        className="-mt-20 mx-auto border  h-full w-full object-contain"
      />

      <View className="absolute w-full left-0 top-[66%] bottom-0 right-0 rounded-2xl py-12 px-4 bg-white-color">
        <CustomTextRegular className="mx-auto text-secondary-accent-color text-sm font-normal text-center ">
          Enhance your scheduling efficiency with our AI-Integrated Calendar
          Assistant, designed to intelligently set and optimise your calendar
          for peak productivity and time management.
        </CustomTextRegular>
        <View className="flex flex-row justify-between items-center mt-10">
          <OnboardingIndicator index={2} />
          <OnboardingButton onpress={handleOnboarding} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen3;
