import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextRegular from "../../components/CustomTextRegular";
import CustomTextInput from "../../components/CustomTextInput";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";
import accountgoal from "../../../assets/accounts.png";
import { useLoginMutation } from "../../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { clearAcgUserData, setAcgUserData } from "../../slices/userSlice";
import TickIcon from "../../Icons/TickIcon";
import PasswordFIeld from "../../components/PasswordField";

const LoginScreen = ({ navigation, route }) => {
  const [login, { isLoading, error: loginError }] = useLoginMutation();
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  const organizationId = route?.params?.organizationId;
  const userId = route?.params?.userId;

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);

  const isDisabled = !email || !password;

  const handleRemeberMe = () => {
    setRememberme(!rememberme);
  };

  const handleForgetPassword = () => {};

  const handleLogin = async () => {
    try {
      const loginBody = { email: email, password: password };
      const response = await login(loginBody);

      if (response?.error) {
        Alert.alert("", response.error?.data?.msg || "Error logging in");
      }

      if (response?.data?._id) {
        dispatch(setAcgUserData({ ...response?.data, login: true }));
        if (organizationId && userId) {
          dispatch(
            setAcgUserData({
              _id: userId,
              organizationId: organizationId,
              invitedUserId: response?.data?._id,
              access: response?.data?.access,
              email: response?.data?.email,
              fullName: response?.data?.fullName,
              mobile: response?.data?.mobile,
              profileImage: response?.data?.profileImage,
              token: response?.data?.token,
              login: true,
            })
          );
        }
        navigation.navigate("Home", { organizationId, userId });
      }
    } catch (error) {
      Alert.alert("", error?.data?.msg);
    }
  };
  return (
    <SafeAreaView className="flex-1 ">
      <KeyboardAvoidingView>
        <ScrollView
          className="px-4 h-full"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Image
            source={accountgoal}
            className="mt-12 h-12 w-1/2 object-contain flex self-center"
          />
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
            isValid={true}
            onChangeText={(text) => setEmail(text)}
          />

          <PasswordFIeld
            showVisibility={true}
            labelColor={"#D7D7D7"}
            placeholder="********"
            label={"Password"}
            required={true}
            isValid={true}
            onChangeText={(text) => setPassword(text)}
          />
          <View className="flex flex-row items-center justify-between mt-8">
            {/* remember me */}
            <Pressable className="flex flex-row gap-x-2 items-center">
              <TouchableOpacity
                className="relative w-6 h-6 flex justify-center items-center  rounded-lg border border-border-color"
                onPress={() => setRememberme(!rememberme)}
              >
                {rememberme && <TickIcon />}
              </TouchableOpacity>
              <CustomTextRegular className="text-sm text-primary-accent-color">
                Remember me
              </CustomTextRegular>
            </Pressable>
            {/* forget password */}
            <TouchableOpacity
              onPress={() => navigation.navigate("forgotPassword")}
              className="py-2"
            >
              <CustomTextRegular className="text-sm text-primary-accent-color">
                Forgot Password?
              </CustomTextRegular>
            </TouchableOpacity>
          </View>
          <LongButtonUnFixed
            isLoading={isLoading}
            text="Login"
            textColor={"#fff"}
            bgColor={"#4169E1"}
            isDisabled={isDisabled}
            disabled={isDisabled}
            marginTop={60}
            on_press={handleLogin}
          />

          {/* dont have an account */}
          <View className="flex flex-row items-center justify-center self-center mt-20">
            <CustomTextRegular className="text-sm text-primary-accent-color">
              Don't have an account?
            </CustomTextRegular>
            <TouchableOpacity
              onPress={() => navigation.navigate("signup")}
              className="py-2 ml-4"
            >
              <CustomTextRegular className="text-primary-color text-base font-semibold ">
                Sign up
              </CustomTextRegular>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* {loginError && Alert.alert("", loginError.error.split(":")[1])} */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
