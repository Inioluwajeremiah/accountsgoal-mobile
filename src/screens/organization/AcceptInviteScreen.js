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
import React, { useEffect, useState } from "react";
import CustomTextRegular from "../../components/CustomTextRegular";
import CustomTextInput from "../../components/CustomTextInput";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";
import CustomPhoneInput from "../../components/CustomPhonetInput";
import {
  useLogoutMutation,
  useRegisterMutation,
} from "../../slices/usersApiSlice";
import isValidEmail from "../../utils/validateEmail";
import { isValidatePhoneNumber } from "../../utils/validatePhone";
import accountgoal from "../../../assets/accounts.png";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAcgUserData,
  setAcgUserData,
  setAcgUserOnboarding,
  setOrganizationId,
  setUserId,
} from "../../slices/userSlice";
import { useRegisterInvitedUserMutation } from "../../slices/organizationApiSlice";
import PasswordFIeld from "../../components/PasswordField";

const AcceptInviteScreen = ({ route, navigation }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  const { organizationId, userId } = route?.params;

  const dispatch = useDispatch();
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

  const [
    registerInvitedUser,
    {
      isLoading: loadingRegisterInvitedUser,
      error: registerInvitedUserError,
      isError: isRegisterInvitedUserError,
      isSuccess: isegisterInvitedUserSuccess,
      success: registerInvitedUserSuccess,
    },
  ] = useRegisterInvitedUserMutation();

  const [logout] = useLogoutMutation();

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
    if (e.length === 0) {
      setFullName(e);
      setIsFullNameValid(false);
      if (isDisabledArray.includes("fullname")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "fullname")
        );
      }
    } else {
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
        mobile: countryCode + mobile,
        password,
        confirmPassword,
      });
      if (res.data.data) {
        dispatch(setUserId(res.data.data.userId));
      }
      if (res.error) {
        Alert.alert(
          "",
          res.error?.message ||
            res.error.data?.msg ||
            res.error?.msg ||
            res.error?.error
        );
        return;
      }

      Alert.alert("", "Sign up succesfully!");

      navigation.navigate("verify", res);
    } catch (error) {
      Alert.alert("", error?.message || error.data.msg);
    }
  };

  const handleRegisterInvitedUser = async () => {
    const response = await registerInvitedUser({
      userId: userId,
      organizationId: organizationId,
      email: email,
      fullName: fullName,
      mobile: countryCode + mobile,
      password: password,
      confirmPassword: confirmPassword,
    });

    if (response?.data?._id) {
      Alert.alert("", "You've successfully signed up!");

      dispatch(
        setAcgUserData({
          _id: userId,
          organizationId: organizationId,
          invitedUserId: response.data?._id,
          access: response.data?.access,
          email: response.data?.email,
          fullName: response.data?.fullName,
          mobile: response.data?.mobile,
          profileImage: response.data?.profileImage,
          token: response.data?.token,
          login: true,
        })
      );
      dispatch(setUserId(userId));
      dispatch(setOrganizationId(organizationId));
      navigation.navigate("Home");
    }
    if (response?.data?.msg) {
      Alert.alert("", response?.data?.msg);
    }
    if (response?.error) {
      Alert.alert("", response?.error?.data?.error);
    }
  };

  // logout user
  const handleLogout = async () => {
    try {
      const res = await logout();

      if (res?.data) {
        dispatch(clearAcgUserData());
      }
    } catch (error) {
      console.log(error);

      Alert.alert("", error.message);
    }
  };

  useEffect(() => {
    dispatch(setAcgUserOnboarding({ onboarding: true }));
    if (accountsGoalUser?.login === true) {
      navigation.navigate("login2", { organizationId, userId });
    }
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="absolute top-0 left-0 w-full h-full flex-1"
      // keyboardVerticalOffset={Platform.OS === "ios" ? 32 : 32}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
        <Image
          source={accountgoal}
          className=" h-12 w-1/2 object-contain flex self-center mt-8"
        />
        <CustomTextRegular className="text-bold text-3xl text-center mt-6">
          Invite link
          {/* and id: {organizationId ? organizationId : ""}{" "}
          {userId ? userId : ""} */}
        </CustomTextRegular>
        {/* <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6">
          Grandida invited you to join the workspace.
        </CustomTextRegular> */}
        {/* email  */}
        <CustomTextInput
          labelColor={"#D7D7D7"}
          placeholder="user@companyname.com"
          label={"Email"}
          required={true}
          isValid={isEmailValid}
          onChangeText={handleEmail}
        />
        <CustomTextInput
          value={fullName}
          labelColor={"#D7D7D7"}
          placeholder="John Doe"
          label={"Full Name"}
          required={true}
          isValid={isFullNameValid}
          onChangeText={handleFullName}
        />
        {/* phone number */}
        <CustomPhoneInput
          labelColor={"#D7D7D7"}
          label={"Phone Number"}
          placeholder="60132776328"
          selectedCode={countryCode}
          onSelectCode={(code) => setCountryCode(code)}
          onChangeText={(text) => setMobile(text)}
        />
        <PasswordFIeld
          showVisibility={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Password"}
          required={true}
          isValid={true}
          onChangeText={handlePassword}
        />
        {/* <CustomTextInput
          // value={password}
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Password"}
          required={true}
          isValid={isValidPassword}
          onChangeText={handlePassword}
        /> */}
        <PasswordFIeld
          showVisibility={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Confirm Password"}
          required={true}
          isValid={true}
          onChangeText={handleConfrmPassword}
        />
        {/* <CustomTextInput
          // value={confirmPassword}
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Confirm Password"}
          required={true}
          isValid={isValidCPassword}
          onChangeText={handleConfrmPassword}
        /> */}
        <LongButtonUnFixed
          isLoading={loadingRegisterInvitedUser}
          text="Signup"
          textColor={"#fff"}
          bgColor={"#4169E1"}
          isDisabled={
            isDisabledArray.length >= 3 || !userId || !organizationId
              ? false
              : true
          }
          disabled={
            isDisabledArray.length >= 3 || !userId || !organizationId
              ? false
              : true
          }
          marginTop={60}
          on_press={handleRegisterInvitedUser}
        />
        {/* already have an account */}
        <View className="flex flex-row items-center justify-center mb-32  mt-8">
          <CustomTextRegular className="text-sm text-primary-accent-color">
            Already have an account
          </CustomTextRegular>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("login2", { organizationId, userId })
            }
          >
            <CustomTextRegular className="text-primary-color text-base font-semibold">
              {" "}
              Login
            </CustomTextRegular>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AcceptInviteScreen;
