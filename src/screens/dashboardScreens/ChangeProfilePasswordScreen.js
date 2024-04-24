import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import CustomTextRegular from "../../components/CustomTextRegular";
import BackIcon from "../../Icons/BackIcon";
import { useEffect, useState } from "react";
import CustomTextInput from "../../components/CustomTextInput";
import DropDownAlert from "../../components/DropDownAlert";
import { useDispatch, useSelector } from "react-redux";
import { useUpdatePasswordMutation } from "../../slices/usersApiSlice";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { isValidPassword as vpwd } from "../../utils/validPassword";
const ChangeProfilePasswordScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const [updatePassword, { isLoading: loadingUpdate, error: updateError }] =
    useUpdatePasswordMutation();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidNewPassword, setIsValidNewPassword] = useState(true);
  const [isValidCPassword, setIsValidCPassword] = useState(true);
  const [isDisabledArray, setisDisabledArray] = useState([]);

  const isValid = isDisabledArray.length === 3;

  const handlePassword = (e) => {
    if (!vpwd(e)) {
      setIsValidPassword(false);
      if (isDisabledArray.includes("pwd")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "pwd")
        );
      }
    } else {
      setPassword(e);
      setIsValidPassword(true);
      if (!isDisabledArray.includes("pwd")) {
        setisDisabledArray((prevArray) => [...prevArray, "pwd"]);
      }
    }
  };
  const handleNewPassword = (e) => {
    if (!vpwd(e)) {
      setIsValidNewPassword(false);
      if (isDisabledArray.includes("npwd")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "npwd")
        );
      }
    } else {
      setNewPassword(e);
      setIsValidNewPassword(true);
      if (!isDisabledArray.includes("npwd")) {
        setisDisabledArray((prevArray) => [...prevArray, "npwd"]);
      }
    }
  };

  const handleConfrmNewPassword = (e) => {
    if (!vpwd(e) || e !== newPassword) {
      setIsValidCPassword(false);
      if (isDisabledArray.includes("cnpwd")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "cnpwd")
        );
      }
    } else {
      setConfirmNewPassword(e);
      setIsValidCPassword(true);
      if (!isDisabledArray.includes("cnpwd")) {
        setisDisabledArray((prevArray) => [...prevArray, "cnpwd"]);
      }
    }
  };

  const handleToggleAlertModal = () => {
    setShowAlertModal(!showAlertModal);
  };

  const handleChangePassword = async () => {
    try {
      const body = {
        token: accountsGoalUser.token,
        oldPassword: password,
        password: confirmNewPassword,
      };
      console.log("update pwd body ===> ", body);
      const res = await updatePassword(body);
      console.log("update pwd response ===>> ", res);
      if (res?.data) {
        setShowAlertModal(true);
      }
      if (res?.error) {
        console.log(" error ===>", res);
        // Alert.alert(
        //   "",
        //   res.error?.message ||
        //     res.error.data?.msg ||
        //     res.error?.msg ||
        //     res.error?.error
        // );
        return;
      }
    } catch (error) {
      console.log("signup error ===>", error);
      // Alert.alert("", error?.message || error.data.msg);
    }
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
      }, 3000);
    }
  });

  return (
    <SafeAreaView className="flex-1">
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          {/* header */}
          <View className="mt-5 flex flex-row items-center mb-10">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon />
            </TouchableOpacity>
            <CustomTextRegular className="text-base font-bold ml-3">
              Password Change
            </CustomTextRegular>
          </View>
          <CustomTextInput
            // value={password}
            secureTextEntry={true}
            labelColor={"#D7D7D7"}
            placeholder="********"
            label={"Password"}
            required={true}
            isValid={isValidPassword}
            onChangeText={(e) => handlePassword(e)}
          />
          <CustomTextInput
            // value={password}
            secureTextEntry={true}
            labelColor={"#D7D7D7"}
            placeholder="********"
            label={"New Password"}
            required={true}
            isValid={isValidNewPassword}
            onChangeText={(e) => handleNewPassword(e)}
          />
          <CustomTextInput
            // value={confirmPassword}
            secureTextEntry={true}
            labelColor={"#D7D7D7"}
            placeholder="********"
            label={"Confirm New Password"}
            required={true}
            isValid={isValidCPassword}
            onChangeText={(e) => handleConfrmNewPassword(e)}
          />
        </View>
        {/* change password button */}
        <View className="pb-10">
          {/* send invitation button */}
          <TouchableOpacity
            disabled={!isValid && true}
            className={` ${!isValid ? "bg-[#789AF3]" : "bg-primary-color"}
           rounded-full mt-16 h-12 py-3 flx justify-center items-center`}
            onPress={handleChangePassword}
          >
            <CustomTextRegular className="text-center font-semibold text-white text-base">
              Change Password
            </CustomTextRegular>
          </TouchableOpacity>
        </View>
        {showAlertModal && (
          <DropDownAlert
            message={"Password change successful"}
            type={"success"}
            showAlertModal={showAlertModal}
            ToggleAlertModal={handleToggleAlertModal}
          />
        )}
      </ScrollView>
      {loadingUpdate && <LottieLoadingScreen loading={loadingUpdate} />}
      {updateError &&
        Alert.alert(
          "",
          updateError?.error ||
            updateError?.error?.data?.msg ||
            updateError?.data?.msg
        )}
    </SafeAreaView>
  );
};

export default ChangeProfilePasswordScreen;
