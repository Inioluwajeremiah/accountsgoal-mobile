import { View, Text } from "react-native";
import React, { useEffect } from "react";
import SuccessAlertScreenComponent from "../../components/SuccessAlertComponent";

const InviteSucessfullScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("createOrganizationSuccessAlert");
    }, 2400);
  }, []);
  return (
    <SuccessAlertScreenComponent
      src={require("../../../assets/emailsent.json")}
      title1={"Invitation sent"}
      subtitle1={
        "Success! An invitation has been sent to your \ncolleague's email address. They will receive all \nthe necessary instructions to join you on \naccountsgoal"
      }
      btntext="emailVerificationSuccessButtonText"
      on_press={() => navigation.navigate("login")}
    />
  );
};

export default InviteSucessfullScreen;
