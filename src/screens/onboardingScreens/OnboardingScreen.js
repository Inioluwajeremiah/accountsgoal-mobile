import { View, SafeAreaView, FlatList, Image, Platform } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import onboarding1 from "../../../assets/onboarding1.png";
import onboarding2 from "../../../assets/onboarding2.png";
import onboarding3 from "../../../assets/onboarding3.png";
import OnboardingIndicator from "../../components/OnboardingIndicator";
import CustomTextRegular from "../../components/CustomTextRegular";
import OnboardingButton from "../../components/OnboardingButton";
import { useDispatch } from "react-redux";
import { setAcgUserOnboarding } from "../../slices/userSlice";
import { status_bar_height, windowWidth } from "../../utils/Dimensions";

const onboardingData = [
  {
    id: 1,
    title: `Geo-Client Mapping\n Interface`,
    image: onboarding1,
    description: `Navigate your sales territory with ease! Our Map View helps you locate clients, view clients and perform tailored actions on client profiles quickly and efficiently.`,
  },
  {
    id: 2,
    title: `Excel Data & Email\n Integration`,
    image: onboarding2,
    description: `Effortlessly synchronize your Excel data and manage email communications directly within the app, streamlining your workflow and enhancing productivity.`,
  },
  {
    id: 3,
    title: `Smart Scheduling\n with AI.`,
    image: onboarding3,
    description: `Enhance your scheduling efficiency with our AI-Integrated Calendar Assistant, designed to intelligently set and optimise your calendar for peak productivity and time management.`,
  },
];
const OnboardingScreen = ({ navigation }) => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  // handle onboarding
  const handleOnboarding = () => {
    dispatch(setAcgUserOnboarding({ onboarding: true }));
    navigation.navigate("signup");
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Calculate the next index based on the current index
      const nextIndex = (currentIndex + 1) % onboardingData.length;
      setCurrentIndex(nextIndex);
      // Scroll to the next item in the FlatList
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }, 15000); // Change slide every 5 seconds (5000 milliseconds)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentIndex, onboardingData.length]);

  return (
    <SafeAreaView
      className="flex-1 bg-onboard-bg"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      <FlatList
        ref={flatListRef}
        className="w-full"
        data={onboardingData}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        renderItem={({ item, index }) => (
          <View key={index} style={{ width: windowWidth }}>
            <CustomTextRegular className="text-black-color mt-10 font-black text-3xl mx-4 text-left leading-[45px]">
              {item.title}
            </CustomTextRegular>
            <Image
              source={item.image}
              className="-mt-16 mx-auto  h-full w-full object-contain"
            />

            <View className="absolute w-full left-0 top-[60%] bottom-0 right-0 rounded-2xl py-12 px-4 bg-white-color">
              <CustomTextRegular className="mx-auto text-secondary-accent-color text-sm font-normal text-center ">
                {item.description}
              </CustomTextRegular>
              <View className="flex flex-row justify-between items-center mt-10">
                <OnboardingIndicator index={index} />
                <OnboardingButton onpress={handleOnboarding} />
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OnboardingScreen;
