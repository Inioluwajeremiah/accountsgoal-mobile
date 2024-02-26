import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import icon from "../../../assets/icon.png";
import CustomTextRegular from "../../components/CustomTextRegular";
import CustomTextInput from "../../components/CustomTextInput";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";
import CustomPhoneInput from "../../components/CustomPhonetInput";
import { useRegisterMutation } from "../../slices/usersApiSlice";
import isValidEmail from "../../utils/validateEmail";
import { isValidatePhoneNumber } from "../../utils/validatePhone";
import accountgoal from "../../../assets/accounts.png";

const PasswordResetScreen = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidCPassword, setIsValidCPassword] = useState(true);

  const [register, { isLoading }] = useRegisterMutation();

  const handlePassword = (e) => {
    if (e.length < 6) {
      setIsValidPassword(false);
    } else {
      setPassword(e);
      setIsValidPassword(true);
    }
  };

  const handleConfrmPassword = (e) => {
    if (e.length < 6 || e !== password) {
      setIsValidCPassword(false);
    } else {
      setConfirmPassword(e);
      setIsValidCPassword(true);
    }
  };

  const handleResetPassword = async () => {
    // navigation.navigate("verify");
    try {
      const res = await register({
        email,
        fullName,
        mobile: countryCode + mobile,
        password,
        confirmPassword,
      });
      if (res.error) {
        console.log("signup response ===>", res);
        Alert.alert("", res.error?.message || res.error.error);
        return;
      }

      Alert.alert("", "Sign up succesfully!");
      navigation.navigate("verify");
    } catch (error) {
      console.log("signup error ===>", error);
      Alert.alert("", error?.message || error.error.error);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="absolute top-0 left-0 w-full h-full flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 32 : 32}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
        <Image
          source={accountgoal}
          className=" h-12 w-1/2 object-contain flex self-center mt-8"
        />

        <CustomTextRegular className="text-bold text-3xl text-center mt-6">
          Password Reset
        </CustomTextRegular>
        <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6"></CustomTextRegular>

        <CustomTextInput
          // value={password}
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Password"}
          required={true}
          isValid={isValidPassword}
          onChangeText={handlePassword}
        />
        <CustomTextInput
          // value={confirmPassword}
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Confirm Password"}
          required={true}
          isValid={isValidCPassword}
          onChangeText={handleConfrmPassword}
        />
        <LongButtonUnFixed
          isLoading={isLoading}
          text="Reset password"
          textColor={"#fff"}
          bgColor={"#4169E1"}
          isDisabled={isValidPassword && isValidCPassword ? false : true}
          disabled={isValidPassword && isValidCPassword ? false : true}
          marginTop={60}
          on_press={handleResetPassword}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PasswordResetScreen;
