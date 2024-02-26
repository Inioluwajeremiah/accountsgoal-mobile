import "react-native-gesture-handler";
import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./SplashScreen";
import { StatusBar } from "expo-status-bar";
import OnboardingScreen1 from "./onboardingScreens/OnboardingScreen1";
import OnboardingScreen2 from "./onboardingScreens/OnboardingScreen2";
import OnboardingScreen3 from "./onboardingScreens/OnboardingScreen3";
import { useSelector } from "react-redux";
import SignUpScreen from "./authScreens/SignUpScreen";
import VerifyUserScreen from "./authScreens/VerifyUserScreen";
import EmailVerificationSuccessAlertScreen from "./AlertScreen/EmailVerificationSuccessAlertScreen";
import LoginScreen from "./authScreens/LoginScreen";
import HomeScreen from "./dashboardScreens/HomeScreen";
import ForgotPasswordScreen from "./authScreens/ForgotPasswordScreen";
import VerifyPasswordResetScreen from "./authScreens/VerifyPasswordResetScreen";
import PasswordResetScreen from "./authScreens/PasswordResetScreen";

const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const { acgUserData } = useSelector((state) => state.acgUser);
  return (
    <>
      <StatusBar style="dark" backgroundColor={"#fff"} translucent={true} />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="splash"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={SplashScreen}
          />
          <Stack.Screen
            name="onboard1"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={OnboardingScreen1}
          />
          <Stack.Screen
            name="onboard2"
            options={{
              headerShown: false,
            }}
            component={OnboardingScreen2}
          />
          <Stack.Screen
            name="onboard3"
            options={{
              headerShown: false,
            }}
            component={OnboardingScreen3}
          />
          <Stack.Screen
            name="signup"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={SignUpScreen}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="verify"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={VerifyUserScreen}
          />
          <Stack.Screen
            name="forgotPassword"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="verifyPasswordReset"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={VerifyPasswordResetScreen}
          />
          <Stack.Screen
            name="passwordReset"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={PasswordResetScreen}
          />

          <Stack.Screen
            name="email"
            options={{
              headerShown: false,
            }}
            component={EmailVerificationSuccessAlertScreen}
          />
          <Stack.Screen
            name="Home"
            options={{
              headerShown: false,
            }}
            component={HomeScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default MainScreen;
