import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useEffect } from "react";
import CustomTextRegular from "../components/CustomTextRegular";
import SplashIcon from "../../assets/SplashIcon";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";

const SplashScreen = ({ navigation, route }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const { onboarding } = useSelector((state) => state.acgUser);
  console.log("user data at splashscreen =>>>> ", accountsGoalUser);
  useEffect(() => {
    const navigateToScreen = async () => {
      try {
        navigation.reset({
          index: 0,
          routes: [
            {
              // name: `${
              //   userData?.login &&
              //   userData?.role === "footballer" &&
              //   userData?.isCompleteOnboarding === true
              //     ? "footballerStackScreen"
              //     : userData?.login &&
              //       userData?.role === "footballer" &&
              //       !userData?.isCompleteOnboarding
              //     ? "footballer_onboarding_first"
              //     : userData?.login && userData?.role === "admin"
              //     ? "adminStackScreen"
              //     : userData?.login &&
              //       userData?.role === "scout" &&
              //       userData?.isCompleteOnboarding
              //     ? "scoutStackScreen"
              //     : userData?.login &&
              //       userData?.role === "scout" &&
              //       !userData?.isCompleteOnboarding
              //     ? "scout_onboarding_first"
              //     : "authStackScreen"
              // }`,
              name: `${
                onboarding && accountsGoalUser?.login
                  ? "Home"
                  : onboarding && !accountsGoalUser?.login
                  ? "login"
                  : "onboard1"
              }`,
            },
          ],
        });
      } catch (error) {
        console.error("Error retrieving userData from AsyncStorage:", error);
        // Handle error, e.g., show a login screen
        navigation.reset({
          index: 0,
          routes: [{ name: "authStackScreen" }],
        });
      }
    };

    const timer = setTimeout(() => {
      navigateToScreen();
    }, 500); // delay navigation for 5 seconds

    return () => clearTimeout(timer); // clear timeout on unmount
  }, [navigation]);
  return (
    <>
      <StatusBar style="light" backgroundColor={"#4169E1"} translucent={true} />
      <SafeAreaView className="flex-1 flex flex-col justify-center items-center bg-primary-color">
        <SplashIcon />
      </SafeAreaView>
    </>
  );
};

export default SplashScreen;
