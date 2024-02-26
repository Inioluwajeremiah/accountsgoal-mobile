import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import React, { createRef, useState } from "react";
import accountgoal from "../../../assets/accounts.png";
import CustomTextRegular from "../../components/CustomTextRegular";
import CustomTextInput from "../../components/CustomTextInput";
import LongButtonUnFixed from "../../components/LongButtonUnFixed";
import { windowWidth } from "../../utils/Dimensions";

const VerifyPasswordResetScreen = ({ navigation, route }) => {
  // const [verify, { isLoading }] = useVerifyMutation();
  // const { email, role, password } = route.params;
  const email = "user@gloriation.com";
  const trimedEmail = email.split("@")[0];
  const boxSize = windowWidth / 6.5;
  const boxArray = [...Array(4).keys()];
  const pRefs = Array.from({ length: boxArray.length }, () => createRef());

  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");

  const handleSignup = async () => {
    navigation.navigate("login");
  };
  // const handleVerify = async () => {
  //   const otp = `${p1}${p2}${p3}${p4}`;
  //   console.log(otp);
  //   try {
  //     const res = await verify({ email, otp }).unwrap();
  //     // dispatch(setCredentials({ ...res }));
  //     Alert.alert("", res.success);
  //     setTimeout(() => {
  //       navigation.navigate("Emailsuccess");
  //     }, 1000);
  //   } catch (error) {
  //     console.log(error);
  //     Alert.alert(
  //       "",
  //       error?.data?.error || error.error || error?.data?.message
  //     );
  //   }
  // };

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
          // isLoading={isLoading}
          text="Verify"
          textColor={"#fff"}
          bgColor={"#4169E1"}
          isDisabled={false}
          disabled={false}
          marginTop={60}
          on_press={() => navigation.navigate("passwordReset")}
        />
        <View className="flex flex-row items-center justify-center mb-32  mt-8">
          <CustomTextRegular className="text-sm text-primary-accent-color">
            Send Code again
          </CustomTextRegular>
          <Pressable>
            <CustomTextRegular className="text-bold text-base font-semibold">
              {" "}
              00:30
            </CustomTextRegular>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyPasswordResetScreen;
