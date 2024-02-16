import { useEffect } from "react";
import SuccessAlertScreenComponent from "../../components/SuccessAlertComponent";

const EmailVerificationSuccessAlertScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("login");
    }, 1500);
  }, []);
  return (
    <SuccessAlertScreenComponent
      src={require("../../../assets/success.json")}
      title1={"Account successfully\n created"}
      subtitle1="Welcome aboard – you're all set to explore and\n utilize our powerful  tools!"
      btntext="emailVerificationSuccessButtonText"
      on_press={() => navigation.navigate("login")}
    />
  );
};

export default EmailVerificationSuccessAlertScreen;
