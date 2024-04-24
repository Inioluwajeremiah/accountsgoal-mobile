import { useEffect } from "react";
import SuccessAlertScreenComponent from "../../components/SuccessAlertComponent";

const CreateOrganizationSucessAlertScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Home");
    }, 1500);
  }, []);
  return (
    <SuccessAlertScreenComponent
      title1="Organization successfully"
      src={require("../../../assets/success.json")}
      title2="created"
      subtitle1="Welcome aboard – you're all set to explore and"
      subtitle2="utilize our powerful tools!"
    />
  );
};

export default CreateOrganizationSucessAlertScreen;
