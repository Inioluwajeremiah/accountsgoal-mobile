import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import icon from "../../../assets/icon.png";
import CustomTextRegular from "../../components/CustomTextRegular";
import CustomTextInput from "../../components/CustomTextInput";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);

  const handleRemeberMe = () => {
    setRememberme(!rememberme);
  };

  const handleForgetPassword = () => {};
  const handleSignup = () => {
    navigation.navigate("verify");
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView className="px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <Image source={icon} className="h-12 w-12 flex self-center" />
        <CustomTextRegular className="text-bold text-3xl text-center mt-6">
          Welcome Back
        </CustomTextRegular>
        <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6">
          Let’s get started from where you stopped.
        </CustomTextRegular>
        {/* email  */}
        <CustomTextInput
          labelColor={"#D7D7D7"}
          placeholder="user@companyname.com"
          label={"Company Email"}
          required={true}
        />

        <CustomTextInput
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Password"}
          required={true}
        />
        <View className="flex flex-row items-center justify-between mt-8">
          {/* remember me */}
          <Pressable className="flex flex-row gap-x-2 items-center">
            <View className="relative w-6 h-6 rounded-lg border border-border-color"></View>
            <CustomTextRegular className="text-sm text-primary-accent-color">
              Remember me
            </CustomTextRegular>
          </Pressable>
          {/* forget password */}
          <Pressable>
            <CustomTextRegular className="text-sm text-primary-accent-color">
              Forget Password?
            </CustomTextRegular>
          </Pressable>
        </View>
        <LongButtonUnFixed
          // isLoading={isLoading}
          text="Signup"
          textColor={"#fff"}
          bgColor={"#4169E1"}
          isDisabled={false}
          disabled={false}
          marginTop={60}
          on_press={handleSignup}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
