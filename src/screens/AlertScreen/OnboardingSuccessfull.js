import React from "react";
import { Alert, Text } from "react-native";
import SuccessAlertScreenComponent from "../../components/SuccessAlertComponent";
import { useSelector } from "react-redux";

const OnboardingSuccessfull = ({ navigation, route }) => {
  const { userData } = useSelector((state) => state.auth);
  const userParams = route.params;

  console.log("userdata at onboarding succesfyll => ", userData);
  return (
    <SuccessAlertScreenComponent
      src={require("../../../assets/success.json")}
      title1="onboardingSuccessTitle"
      title2=""
      subtitle1="onboardingSuccessSubTitle"
      subtitle2=""
      btntext="onboardingSuccessButtonText"
      on_press={() =>
        navigation.navigate(
          `${
            userData?.role === "footballer"
              ? "footballerStackScreen"
              : userData?.role === "scout"
              ? "scoutStackScreen"
              : ""
          }`
        )
      }
    />
  );
};

export default OnboardingSuccessfull;
