import { View, Text, SafeAreaView, Image, Pressable } from "react-native";
import React from "react";
import OnboardingIndicator from "../../components/OnboardingIndicator";
import CustomTextRegular from "../../components/CustomTextRegular";
import onboarding1 from "../../../assets/onboarding1.png";
import OnboardingButton from "../../components/OnboardingButton";
import { StatusBar } from "expo-status-bar";
const OnboardingScreen1 = ({ navigation }) => {
  const handleMoveToScreen2 = () => {
    navigation.navigate("onboard2");
  };
  return (
    <SafeAreaView className="flex-1 bg-onboard-bg">
      <CustomTextRegular className="text-black-color mt-10 font-black text-3xl mx-4 text-left leading-[45px]">
        Geo-Client Mapping{"\n"} Interface
      </CustomTextRegular>
      <Image
        source={onboarding1}
        className="-mt-20 mx-auto border  h-full w-full object-contain"
      />

      <View className="absolute w-full left-0 top-[66%] bottom-0 right-0 rounded-2xl py-12 px-4 bg-white-color">
        <CustomTextRegular className="mx-auto text-secondary-accent-color text-sm font-normal text-center ">
          Navigate your sales territory with ease! Our Map View helps you locate
          clients, view clients and perform tailored actions on client profiles
          quickly and efficiently.
        </CustomTextRegular>
        <View className="flex flex-row justify-between items-center mt-10">
          <OnboardingIndicator index={0} />
          <OnboardingButton onpress={handleMoveToScreen2} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen1;
