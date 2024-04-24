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
import React, { useState } from "react";
import CustomTextRegular from "../../components/CustomTextRegular";
import CustomTextInput from "../../components/CustomTextInput";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";
import accountgoal from "../../../assets/accounts.png";
import { useLoginMutation } from "../../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setAcgUserData } from "../../slices/userSlice";
import TickIcon from "../../Icons/TickIcon";
import PasswordFIeld from "../../components/PasswordField";

const LoginScreen = ({ navigation }) => {
  const [login, { isLoading, error: loginError }] = useLoginMutation();
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  console.log("accountsGoalUser login ===> ", accountsGoalUser);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);

  const handleRemeberMe = () => {
    setRememberme(!rememberme);
  };

  const handleForgetPassword = () => {};

  const handleLogin = async () => {
    try {
      console.log("email and password", email + " <====> " + password);
      const loginBody = { email: email, password: password };
      const response = await login(loginBody).unwrap();
      if (response.error) {
        console.log(" response ===>", response);
        // Alert.alert(
        //   "",
        //   response.error?.message ||
        //     response.error?.data.msg ||
        //     response.error?.msg ||
        //     response.error?.error ||
        //     loginError.error.split(":")[1]
        // );

        console.log("login error i ==> ", loginError);
        // Alert.alert("", error);
        // return;
        // davidson@accountsgoal.com
        // Accountsgoal12@@
      }

      console.log("login response ===>", response);
      if (response?.data?._id) {
        dispatch(setAcgUserData({ ...response.data, login: true }));
        navigation.navigate("Home");
      }
      if (response?.token) {
        dispatch(setAcgUserData({ ...response, login: true }));
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log("login error c ===> ", error);
      Alert.alert("", error.data.msg);
    }
  };
  return (
    <SafeAreaView className="flex-1">
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
            >
              <CustomTextRegular className="text-sm text-primary-accent-color">
                Forget Password?
              </CustomTextRegular>
            </TouchableOpacity>
          </View>
          <LongButtonUnFixed
            isLoading={isLoading}
            text="Login"
            textColor={"#fff"}
            bgColor={"#4169E1"}
            isDisabled={false}
            disabled={false}
            marginTop={60}
            on_press={handleLogin}
          />

          {/* dont have an account */}
          <View className="absolute bottom-10 flex flex-row items-center justify-center self-center mt-8">
            <CustomTextRegular className="text-sm text-primary-accent-color">
              Dont have an account
            </CustomTextRegular>
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
              <CustomTextRegular className="text-primary-color text-base font-semibold">
                {" "}
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
