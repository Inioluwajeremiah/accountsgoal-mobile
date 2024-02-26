import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
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

const LoginScreen = ({ navigation }) => {
  const [login, { isLoading, error }] = useLoginMutation();
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);

  const handleRemeberMe = () => {
    setRememberme(!rememberme);
  };

  const handleForgetPassword = () => {};

  const handleLogin = async () => {
    const response = await login({ email, password, rememberme });
    if (response?.success) {
      dispatch(setAcgUserData({ ...accountsGoalUser, response }));
      navigation.navigate("Home");
    }
    // navigation.navigate("Home");
  };
  return (
    <KeyboardAvoidingView>
      <ScrollView
        className="px-4 h-full"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Image
          source={accountgoal}
          className=" h-12 w-1/2 object-contain flex self-center mt-8"
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
        />

        <CustomTextInput
          secureTextEntry={true}
          labelColor={"#D7D7D7"}
          placeholder="********"
          label={"Password"}
          required={true}
          isValid={true}
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
          // isLoading={isLoading}
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
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
