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
import BackIcon from "../../Icons/BackIcon";
import * as Clipboard from "expo-clipboard";

const VerifyPasswordResetScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const [verify, { isLoading }] = useVerifyMutation();
  const [resendOtp, { isLoading: loadingResendOtp, error: otpError }] =
    useResendOtpMutation();
  const [otpInput, setOtpInput] = useState([]);
  const [isAltered, setIsAltered] = useState(false);
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");
  const [countDown, setCountDown] = useState(60);

  const fromParam = route.params;
  const boxSize = windowWidth / 6.5;
  const boxArray = [...Array(4).keys()];
  const pRefs = Array.from({ length: boxArray.length }, () => createRef());

  const otpReducer = otpInput.reduce((accumulator, item) => {
    if (item.code === "") {
      return accumulator + 1;
    }
    return accumulator;
  }, 0);

  const otp = `${p1}${p2}${p3}${p4}`;

  useEffect(() => {
    const x = setInterval(() => {
      if (countDown > 0) {
        setCountDown((prevCount) => prevCount - 1);
      }
    }, 1000);
    return () => clearInterval(x);
  }, [countDown]);

  const handlePasteOtpCode = async () => {
    const copiedCodes = await Clipboard.getStringAsync();
    const otpcodes = copiedCodes.split("");
    if (otpcodes.length === 4 && otpInput.length === 0) {
      setOtpInput(
        otpcodes.map((item, index) => {
          return { status: false, code: otpcodes[index] };
        })
      );
      otpInput.map(
        (item, index) => (pRefs[index].current.value = otpcodes[index])
      );
    }
    // return;
  };
  const handleCodes = [
    (e) => {
      const type = typeof e;
      setP1(e);
      if (e.length === 1 && e !== "") {
        pRefs[1].current.focus();
      }
    },

    (e) => {
      setP2(e);
      if (e.length === 1 && e !== "") {
        pRefs[2].current.focus();
      }
    },

    (e) => {
      setP3(e);
      if (e.length === 1 && e !== "") {
        pRefs[3].current.focus();
      }
    },

    (e) => {
      setP4(e);
      if (e.length === 1 && e !== "") {
      }
    },
  ];

  const handleKeyPress = (nativeEvent, index) => {
    // if (nativeEvent.key === "Backspace" && !pRefs[index]) {
    if (nativeEvent.key === "Backspace") {
      if (index > 0) {
        pRefs[index - 1].current.focus();
      }
      // Alert.alert("", "back space");
    }
  };

  const handleVerify = async () => {
    const otp = `${p1}${p2}${p3}${p4}`;

    try {
      const res = await verify({
        userId: fromParam.userId,
        otp: otp,
      });

      console.log("handleVerify response ===> ", res);

      if (res.error) {
        Alert.alert(
          "",
          res.error?.message || res.error.data?.msg || res.error?.data?.error
        );
        return;
      }
      Alert.alert("", res.data?.message);
      setTimeout(() => {
        navigation.navigate("passwordReset", {
          userId: res?.data?._id,
          otp: otp,
          email: res?.data?.email,
        });
      }, 1000);
    } catch (error) {
      Alert.alert("", error?.data?.error || error.error || error?.data?.msg);
    }
  };

  const handleResendCode = async () => {
    setCountDown(0);
    const resendBody = {
      ...fromParam,
    };
    try {
      const res = await resendOtp({
        ...fromParam,
      });

      console.log("resendOtp response ==> ", res);
      if (res?.data) {
        Alert.alert("", res.data?.message);
        // dispatch(setUserId(res.data?.accountsGoalUser?._id));
        setCountDown(60);
      }
      if (res.error) {
        Alert.alert(
          "",

          res.error.data?.msg
        );
        return;
      }
    } catch (error) {
      Alert.alert("", error?.message || error.data.msg);
    }
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView className="px-4" contentContainerStyle={{ flexGrow: 1 }}>
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
        <CustomTextRegular className="text-secondary-accent-color text-center text-sm my-3 leading-6">
          We have sent an OTP to the email address you provided.
        </CustomTextRegular>

        {/* code box */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex flex-row gap-x-6 justify-center items-center mt-10  mb-4"
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
                maxLength={1}
                ref={pRefs[index]}
                onChangeText={handleCodes[index]}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent, index)
                }
              />
            </View>
          ))}
        </KeyboardAvoidingView>

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
            {loadingResendOtp ? (
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
              {countDown > 0 ? countDown : ""}
            </CustomTextRegular>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyPasswordResetScreen;
