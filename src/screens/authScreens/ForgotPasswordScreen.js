import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import CustomTextRegular from "../../components/CustomTextRegular";
import CustomTextInput from "../../components/CustomTextInput";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";
import accountgoal from "../../../assets/accounts.png";
import {
  useForgetPasswordMutation,
  useLoginMutation,
} from "../../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setAcgUserData } from "../../slices/userSlice";
import TickIcon from "../../Icons/TickIcon";
import isValidEmail from "../../utils/validateEmail";

const ForgotPasswordScreen = ({ navigation }) => {
  const [forgetPassword, { isLoading, error }] = useForgetPasswordMutation();
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmail = (e) => {
    if (!isValidEmail(e)) {
      setIsEmailValid(false);
    } else if (isValidEmail(e)) {
      setIsEmailValid(true);
      setEmail(e);
    }
  };

  const handleSendCode = async () => {
    try {
      const response = await forgetPassword({ email });

      console.log("email => ", email);

      if (response.error) {
        console.log("signup response ===>", response);
        Alert.alert(
          "",
          response.error?.message ||
            response.error.data?.msg ||
            response.error?.msg
        );
        return;
      }
      if (response?.data) {
        setTimeout(() => {
          Alert.alert("", response.data.message);
          navigation.navigate("verifyPasswordReset");
        }, 1000);
      }

      console.log("login response ====>", response);
    } catch (error) {
      console.log("login error ===> ", error);
    }
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView className="px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <Image
          source={accountgoal}
          className=" h-12 w-1/2 object-contain flex self-center mt-8"
        />
        <CustomTextRegular className="text-bold text-3xl text-center mt-6">
          Forgot Password?
        </CustomTextRegular>
        <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6">
          No worries! You can reset it in just a few steps.
        </CustomTextRegular>
        {/* email  */}

        <CustomTextInput
          labelColor={"#D7D7D7"}
          placeholder="user@companyname.com"
          label={"Email"}
          required={true}
          isValid={isEmailValid}
          onChangeText={handleEmail}
        />

        <LongButtonUnFixed
          isLoading={isLoading}
          text="Send Code"
          textColor={"#fff"}
          bgColor={"#4169E1"}
          isDisabled={email ? false : true}
          disabled={email ? false : true}
          marginTop={60}
          on_press={handleSendCode}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;
