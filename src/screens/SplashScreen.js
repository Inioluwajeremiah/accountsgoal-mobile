import { SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import SplashIcon from "../Icons/SplashIcon";
import { useNavigation } from "@react-navigation/native";

const SplashScreen = ({ navigation, route }) => {
  const { accountsGoalUser, onboarding } = useSelector(
    (state) => state.acgUser
  );
  useEffect(() => {
    const navigateToScreen = async () => {
      try {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: `${
                onboarding && accountsGoalUser?.login
                  ? "Home"
                  : onboarding && !accountsGoalUser?.login
                    ? "login"
                    : "onboard"
              }`,
              // name: `${"notes"}`,
            },
          ],
        });
      } catch (error) {
        navigation.reset({
          index: 0,
          routes: [{ name: "login" }],
        });
      }
    };

    const timer = setTimeout(() => {
      navigateToScreen();
    }, 1500);

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
