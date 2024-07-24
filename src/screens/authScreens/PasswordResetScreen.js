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
import { useResetPasswordMutation } from "../../slices/usersApiSlice";
import accountgoal from "../../../assets/accounts.png";
import BackIcon from "../../Icons/BackIcon";
import PasswordFIeld from "../../components/PasswordField";

const PasswordResetScreen = ({ navigation, route }) => {
  const { userId, otp, email } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidCPassword, setIsValidCPassword] = useState(true);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

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
    try {
      const res = await resetPassword({
        userId: userId,
        password: password,
        confirmPassword: confirmPassword,
        otp: otp,
      });

      console.log("resetPassword response ==> ", res);
      if (res.error) {
        Alert.alert("", res.error?.data?.msg);
        return;
      }

      if (res.data) {
        setTimeout(() => {
          Alert.alert("", res?.data?.data?.message || res?.data?.message);
          navigation.navigate("passwordAlert");
        }, 1000);
      }
    } catch (error) {
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
        {/* header */}
        <View className="mt-10 flex flex-row items-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute"
          >
            <BackIcon />
          </TouchableOpacity>
          <View className="flex-1 ">
            <Image
              source={accountgoal}
              className=" h-14 w-2/3 ml-3 object-contain flex self-center"
            />
          </View>
        </View>
        <CustomTextRegular className="text-bold text-3xl text-center mt-6">
          Password Reset
        </CustomTextRegular>
        <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6"></CustomTextRegular>

        <PasswordFIeld
          showVisibility={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Password"}
          required={true}
          isValid={isValidPassword}
          onChangeText={handlePassword}
        />
        <PasswordFIeld
          showVisibility={true}
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
