import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
  Alert,
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

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [isPhoneNUmberValid, setIsPhoneNUmberValid] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidCPassword, setIsValidCPassword] = useState(true);
  const [isDisabledArray, setisDisabledArray] = useState([]);

  const [register, { isLoading }] = useRegisterMutation();

  const handleEmail = (e) => {
    if (!isValidEmail(e)) {
      setIsEmailValid(false);
      if (isDisabledArray.includes("email")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "email")
        );
      }
    } else if (isValidEmail(e)) {
      setEmail(e);
      setIsEmailValid(true);
      if (!isDisabledArray.includes("email")) {
        setisDisabledArray((prevArray) => [...prevArray, "email"]);
      }
    }
  };

  const handleFullName = (e) => {
    if (fullName.length < 2) {
      setIsFullNameValid(false);
      if (isDisabledArray.includes("fullname")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "fullname")
        );
      }
    } else if (fullName.length > 3) {
      setFullName(e);
      setIsFullNameValid(true);
      if (!isDisabledArray.includes("fullname")) {
        setisDisabledArray((prevArray) => [...prevArray, "fullname"]);
      }
    }
  };

  const handlePhoneNumber = (e) => {
    if (!isValidatePhoneNumber(e)) {
      setIsPhoneNUmberValid(false);
    } else if (isValidatePhoneNumber(e)) {
      setMobile(e);
      setIsPhoneNUmberValid(true);
    }
  };

  const handlePassword = (e) => {
    if (e.length < 6) {
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

  const handleConfrmPassword = (e) => {
    if (e.length < 6 || e !== password) {
      setIsValidCPassword(false);
      if (isDisabledArray.includes("cpwd")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "cpwd")
        );
      }
    } else {
      setConfirmPassword(e);
      setIsValidCPassword(true);
      if (!isDisabledArray.includes("cpwd")) {
        setisDisabledArray((prevArray) => [...prevArray, "cpwd"]);
      }
    }
  };

  const handleSignup = async () => {
    try {
      const res = await register({
        email,
        fullName,
        mobile,
        password,
        confirmPassword,
      });
      Alert.alert("", "Sign up succesfully!");
      navigation.navigate("verify");
    } catch (error) {
      Alert.alert("", error?.message);
    }
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView className="px-4" contentContainerStyle={{ flexGrow: 1 }}>
        <Image source={icon} className="h-12 w-12 flex self-center" />
        <CustomTextRegular className="text-bold text-3xl text-center mt-6">
          Create account
        </CustomTextRegular>
        <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6">
          it's your first step towards streamlined management and enhanced
          productivity.
        </CustomTextRegular>
        {/* email  */}
        <CustomTextInput
          labelColor={"#D7D7D7"}
          placeholder="user@companyname.com"
          label={"Email"}
          required={true}
          isValid={isEmailValid}
          onChangeText={(text) => handleEmail(text)}
        />
        <CustomTextInput
          labelColor={"#D7D7D7"}
          placeholder="John Doe"
          label={"Full Name"}
          required={true}
          isValid={isFullNameValid}
          onChangeText={(text) => handleFullName(text)}
        />
        {/* phone number */}
        {/* <CustomPhoneInput
          labelColor={"#D7D7D7"}
          label={"Phone Number"}
          placeholder="60132776328"
          selectedCode={countryCode}
          onSelectCode={(code) => setCountryCode(code)}
          onChangeText={(text) => handlePhoneNumber(text)}
        /> */}
        <CustomTextInput
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Password"}
          required={true}
          isValid={isValidPassword}
          onChangeText={(text) => handlePassword(text)}
        />
        <CustomTextInput
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Confirm Password"}
          required={true}
          isValid={isValidCPassword}
          onChangeText={(text) => handleConfrmPassword(text)}
        />
        <LongButtonUnFixed
          isLoading={isLoading}
          text="Signup"
          textColor={"#fff"}
          bgColor={"#4169E1"}
          isDisabled={isDisabledArray.length >= 3 ? false : true}
          disabled={isDisabledArray.length >= 3 ? false : true}
          marginTop={60}
          on_press={handleSignup}
        />
        <View className="flex flex-row items-center justify-center mb-32  mt-8">
          <CustomTextRegular className="text-sm text-primary-accent-color">
            {" "}
            Already have an account
          </CustomTextRegular>
          <Pressable>
            <CustomTextRegular className="text-primary-color text-base font-semibold">
              {" "}
              Login
            </CustomTextRegular>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;
