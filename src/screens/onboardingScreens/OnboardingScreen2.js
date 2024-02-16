import { View, Text, SafeAreaView, Image, Pressable } from "react-native";
import React from "react";
import OnboardingIndicator from "../../components/OnboardingIndicator";
import CustomTextRegular from "../../components/CustomTextRegular";
import onboarding2 from "../../../assets/onboarding2.png";
import OnboardingButton from "../../components/OnboardingButton";

const OnboardingScreen2 = ({ navigation }) => {
  const handleMoveToScreen3 = () => {
    navigation.navigate("onboard3");
  };

  return (
    <SafeAreaView className="flex-1 bg-onboard-bg">
      <CustomTextRegular className="text-black-color mt-10 font-black text-3xl mx-4 text-left leading-[45px]">
        Excel Data & Email{"\n"} Integration
      </CustomTextRegular>
      <Image
        source={onboarding2}
        className="-mt-20 mx-auto border  h-full w-full object-contain"
      />

      <View className="absolute w-full left-0 top-[66%] bottom-0 right-0 rounded-2xl py-12 px-4 bg-white-color">
        <CustomTextRegular className="mx-auto text-secondary-accent-color text-sm font-normal text-center ">
          Effortlessly synchronize your Excel data and manage email
          communications directly within the app, streamlining your workflow and
          enhancing productivity.
        </CustomTextRegular>
        <View className="flex flex-row justify-between items-center mt-10">
          <OnboardingIndicator index={1} />
          <OnboardingButton onpress={handleMoveToScreen3} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen2;
