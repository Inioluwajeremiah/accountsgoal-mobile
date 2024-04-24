import { useEffect } from "react";
import SuccessAlertScreenComponent from "../../components/SuccessAlertComponent";

const PasswordVerificationSuccessAlertScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("login");
    }, 1500);
  }, []);
  return (
    <SuccessAlertScreenComponent
      src={require("../../../assets/success.json")}
      title1={"Password Changed"}
      subtitle1="Your password has been successfully changed. \nYou can now log in with your new password"
      btntext="emailVerificationSuccessButtonText"
      on_press={() => navigation.navigate("login")}
    />
  );
};

export default PasswordVerificationSuccessAlertScreen;
