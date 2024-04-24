import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { createRef, useEffect, useState } from "react";
import accountgoal from "../../../assets/accounts.png";
import CustomTextRegular from "../../components/CustomTextRegular";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";
import { windowWidth } from "../../utils/Dimensions";
import { formatTime } from "../../utils/formatTIme";
import {
  useRegisterMutation,
  useResendOtpMutation,
  useVerifyMutation,
} from "../../slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "../../slices/userSlice";

const VerifyPasswordResetScreen = ({ navigation, route }) => {
  const { userId } = useSelector((state) => state.acgUser);
  const dispatch = useDispatch();

  console.log("userId ===> ", userId);
  const [verify, { isLoading }] = useVerifyMutation();
  const [register, { isLoading: loadingResend }] = useRegisterMutation();
  const [resendOtp, { isLoading: loadingOtp, error: otpError }] =
    useResendOtpMutation();

  const fromParam = route.params;

  console.log("fromParam  ===> ", fromParam);

  const boxSize = windowWidth / 6.5;
  const boxArray = [...Array(4).keys()];
  const pRefs = Array.from({ length: boxArray.length }, () => createRef());

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");

  const [countDown, setCountDown] = useState(60);

  useEffect(() => {
    const x = setInterval(() => {
      if (countDown > 0) {
        setCountDown((prevCount) => prevCount - 1);
      }
    }, 1000);
    return () => clearInterval(x);
  }, [countDown]);

  const handleVerify = async () => {
    const otp = `${p1}${p2}${p3}${p4}`;
    console.log(otp);
    try {
      const res = await verify({
        userId: userId,
        otp: otp,
      });
      // dispatch(setCredentials({ ...res }));
      if (res.error) {
        console.log("signup response ===>", res);
        Alert.alert(
          "",
          res.error?.message || res.error.data?.msg || res.error?.msg
        );
        return;
      }
      console.log("verify user ==>", res);
      Alert.alert("", res.data?.message);
      setTimeout(() => {
        navigation.navigate("passwordReset");
      }, 1000);
    } catch (error) {
      console.log(error);
      Alert.alert("", error?.data?.error || error.error || error?.data?.msg);
    }
  };

  const handleCodes = [
    (e) => {
      const type = typeof e;
      setP1(e);
      if (e.length === 1 && e !== " ") {
        pRefs[1].current.focus();
      }
    },

    (e) => {
      setP2(e);
      if (e.length === 1 && e !== " ") {
        pRefs[2].current.focus();
      }
    },

    (e) => {
      setP3(e);
      if (e.length === 1 && e !== " ") {
        pRefs[3].current.focus();
      }
    },

    (e) => {
      setP4(e);
      if (e.length === 1 && e !== " ") {
        // handleNext();
      }
    },
  ];

  const handleResendCode = async () => {
    try {
      const res = await resendOtp(fromParam);
      console.log("sign up response ===>> ", res);
      if (res.data) {
        dispatch(setUserId(res.data.userId));
      }
      if (res.error) {
        console.log("signup response error ===>", res);
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
      console.log("signup error ===>", error);
      Alert.alert("", error?.message || error.data.msg);
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
          Password Reset
        </CustomTextRegular>
        <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6">
          We’ve sent an otp to the mail you provided us
        </CustomTextRegular>

        {/* code box */}
        <View
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex flex-row gap-x-6 justify-center items-center my-4"
        >
          {boxArray.map((item, index) => (
            <View
              key={index}
              className="relative flex flex-row w-full justify-center items-center border border-border-color  rounded-3xl"
              style={{ height: boxSize, width: boxSize }}
            >
              <TextInput
                cursorColor={"#D7D7D7"}
                placeholderTextColor={"#D7D7D7"}
                className={`h-full w-full p-2 text-center text-black font-black  text-2xl`}
                keyboardType="number-pad"
                // keyboardType="email-address"
                maxLength={1}
                ref={pRefs[index]}
                onChangeText={handleCodes[index]}
              />
            </View>
          ))}
        </View>

        <LongButtonUnFixed
          isLoading={isLoading}
          text="Verify"
          textColor={"#fff"}
          bgColor={"#4169E1"}
          isDisabled={false}
          disabled={false}
          marginTop={60}
          on_press={handleVerify}
        />
        <View className="flex flex-row items-center justify-center mb-32  mt-8">
          <TouchableOpacity onPress={handleResendCode}>
            {loadingResend ? (
              <ActivityIndicator size={"small"} color={"#4169E1"} />
            ) : (
              <CustomTextRegular className="text-sm text-primary-accent-color">
                Send Code again
              </CustomTextRegular>
            )}
          </TouchableOpacity>
          <Pressable>
            <CustomTextRegular className="text-bold text-base font-semibold">
              {" "}
              {formatTime(countDown)}
            </CustomTextRegular>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyPasswordResetScreen;
