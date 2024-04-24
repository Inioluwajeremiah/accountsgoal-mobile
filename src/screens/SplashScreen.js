import { View, Text, SafeAreaView, Image } from "react-native";
import React, { useEffect } from "react";
import CustomTextRegular from "../components/CustomTextRegular";
import SplashIcon from "../../assets/SplashIcon";
import { useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";

const SplashScreen = ({ navigation, route }) => {
  const { accountsGoalUser, onboarding } = useSelector(
    (state) => state.acgUser
  );
  // const { onboarding } = useSelector((state) => state.acgUser);
  console.log("user data at splashscreen =>>>> ", accountsGoalUser);
  useEffect(() => {
    const navigateToScreen = async () => {
      try {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: `${
                accountsGoalUser?.login &&
                accountsGoalUser?.role === "footballer" &&
                accountsGoalUser?.isCompleteOnboarding === true
                  ? "footballerStackScreen"
                  : accountsGoalUser?.login &&
                      accountsGoalUser?.role === "footballer" &&
                      !accountsGoalUser?.isCompleteOnboarding
                    ? "footballer_onboarding_first"
                    : accountsGoalUser?.login &&
                        accountsGoalUser?.role === "admin"
                      ? "adminStackScreen"
                      : accountsGoalUser?.login &&
                          accountsGoalUser?.role === "scout" &&
                          accountsGoalUser?.isCompleteOnboarding
                        ? "scoutStackScreen"
                        : accountsGoalUser?.login &&
                            accountsGoalUser?.role === "scout" &&
                            !accountsGoalUser?.isCompleteOnboarding
                          ? "scout_onboarding_first"
                          : "authStackScreen"
              }`,
              name: `${
                onboarding && accountsGoalUser?.login
                  ? "Home"
                  : onboarding && !accountsGoalUser?.login
                    ? "login"
                    : "onboard1"
              }`,
              // name: `${"verify"}`,
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
