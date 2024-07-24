import "react-native-gesture-handler";
import { View, Text, Alert, SafeAreaView } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./SplashScreen";
import OnboardingScreen1 from "./onboardingScreens/OnboardingScreen1";
import OnboardingScreen2 from "./onboardingScreens/OnboardingScreen2";
import OnboardingScreen3 from "./onboardingScreens/OnboardingScreen3";
import { useDispatch, useSelector } from "react-redux";
import SignUpScreen from "./authScreens/SignUpScreen";
import VerifyUserScreen from "./authScreens/VerifyUserScreen";
import EmailVerificationSuccessAlertScreen from "./AlertScreen/EmailVerificationSuccessAlertScreen";
import LoginScreen from "./authScreens/LoginScreen";
import HomeScreen from "./dashboardScreens/HomeScreen";
import ForgotPasswordScreen from "./authScreens/ForgotPasswordScreen";
import VerifyPasswordResetScreen from "./authScreens/VerifyPasswordResetScreen";
import PasswordResetScreen from "./authScreens/PasswordResetScreen";
import CreateOrganizationScreen from "./organization/CreateOrganizationScreen";
import InviteOthersScreen from "./organization/InviteOthersScreen";
import EditOrganizationScreen from "./organization/EditOrganizationScreen";
import OrganizationProfileScreen from "./organization/OrganizationProfileScreen";
import InviteSucessfullScreen from "./AlertScreen/InviteSucessfullScreen";
import CreateOrganizationSucessAlertScreen from "./AlertScreen/CreateOrganizationSucessAlertScreen";
import ProfileInfoScreen from "./dashboardScreens/ProfileInfoScreen";
import ChangeProfilePasswordScreen from "./dashboardScreens/ChangeProfilePasswordScreen";
import * as Linking from "expo-linking";
import SearchTodos from "./dashboardScreens/SearchTodos";
import SearchGoals from "./dashboardScreens/SearchGoals";
import SupportChatScreen from "./dashboardScreens/SupportChatScreen";

import OnboardingScreen from "./onboardingScreens/OnboardingScreen";
import NoteScreen from "./dashboardScreens/NoteScreen";
import { StatusBar } from "expo-status-bar";
import NotificationScreen from "./dashboardScreens/NotificationScreen";
import AcceptInviteScreen from "./organization/AcceptInviteScreen";
import { useEffect } from "react";
import { windowHeight } from "../utils/Dimensions";
import {
  setAcgUserData,
  setOrganizationId,
  setUserId,
} from "../slices/userSlice";
import { useGetUserUnderOrganizationsQuery } from "../slices/organizationApiSlice";
import PasswordVerificationSuccessAlertScreen from "./AlertScreen/PasswordVerificationSuccessAlertScreen";

const prefix = Linking.createURL("/");
const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const dispatch = useDispatch();
  const { accountsGoalUser, accountsGoalOrganisation, onboarding } =
    useSelector((state) => state.acgUser);

  // const linking = {
  //   prefixes: [prefix, "https://www.accountsgoal.com", "accountgoal://"],
  //   config: {
  //     screens: {
  //       AcceptInvite: "invite-signup/:organizationId/:userId",
  //     },
  //   },
  // };
  const linking = {
    prefixes: [prefix, "https://www.accountsgoal.com", "accountgoal://"],
    config: {
      screens: {
        AcceptInvite: "invite-signup",
      },
    },
    getStateFromPath: (path, config) => {
      const params = new URLSearchParams(path.split("?")[1]);
      const organizationId = params.get("organizationId");
      const userId = params.get("userId");

      if (organizationId && userId && accountsGoalUser?._id) {
        dispatch(
          setAcgUserData({
            _id: userId,
            organizationId: organizationId,
            invitedUserId: accountsGoalUser?._id,
            access: accountsGoalUser?.access,
            email: accountsGoalUser?.email,
            fullName: accountsGoalUser?.fullName,
            mobile: accountsGoalUser?.mobile,
            profileImage: accountsGoalUser?.profileImage,
            token: accountsGoalUser?.token,
            login: true,
          })
        );
        dispatch(setUserId(userId));
        dispatch(setOrganizationId(organizationId));
      }
      return {
        routes: [
          {
            name: "AcceptInvite",
            params: {
              organizationId,
              userId,
            },
          },
        ],
      };
    },
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-color">
      {/* <StatusBar barStyle={"light-content"} style="auto" /> */}
      <StatusBar barStyle={"light-content"} backgroundColor={"#4169E1"} />

      <NavigationContainer linking={linking}>
        <Stack.Navigator>
          {/* <Stack.Screen
            name="splash"
            options={{
              headerShown: false,
              statusBarHidden: false,
              statusBarTranslucent: true,
            }}
            component={SplashScreen}
          /> */}

          {onboarding && accountsGoalUser?.login ? (
            <Stack.Screen
              name="Home"
              options={{
                headerShown: false,
              }}
              component={HomeScreen}
            />
          ) : onboarding && !accountsGoalUser?.login ? (
            <Stack.Screen
              name="login"
              options={{
                headerShown: false,
                statusBarHidden: false,
                statusBarTranslucent: true,
              }}
              component={LoginScreen}
            />
          ) : (
            <Stack.Screen
              name="onboard"
              options={{
                headerShown: false,
                statusBarHidden: false,
                statusBarTranslucent: true,
              }}
              component={OnboardingScreen}
            />
          )}

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
            name="login2"
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
            name="passwordAlert"
            options={{
              headerShown: false,
            }}
            component={PasswordVerificationSuccessAlertScreen}
          />

          {/* organization */}
          <Stack.Screen
            name="createOrganization"
            options={{
              headerShown: false,
            }}
            component={CreateOrganizationScreen}
          />
          <Stack.Screen
            name="inviteOthers"
            options={{
              headerShown: false,
            }}
            component={InviteOthersScreen}
          />
          <Stack.Screen
            name="editOrganization"
            options={{
              headerShown: false,
            }}
            component={EditOrganizationScreen}
          />
          <Stack.Screen
            name="organizationProfile"
            options={{
              headerShown: false,
            }}
            component={OrganizationProfileScreen}
          />
          <Stack.Screen
            name="inviteSuccessAlert"
            options={{
              headerShown: false,
            }}
            component={InviteSucessfullScreen}
          />
          <Stack.Screen
            name="createOrganizationSuccessAlert"
            options={{
              headerShown: false,
            }}
            component={CreateOrganizationSucessAlertScreen}
          />

          {/* profile */}
          <Stack.Screen
            name="profileInfo"
            options={{
              headerShown: false,
            }}
            component={ProfileInfoScreen}
          />
          <Stack.Screen
            name="changeProfilePassword"
            options={{
              headerShown: false,
            }}
            component={ChangeProfilePasswordScreen}
          />
          <Stack.Screen
            name="searchTodo"
            options={{
              headerShown: false,
            }}
            component={SearchTodos}
          />
          <Stack.Screen
            name="searchGoals"
            options={{
              headerShown: false,
            }}
            component={SearchGoals}
          />
          <Stack.Screen
            name="Support Chat"
            options={{
              headerShown: false,
            }}
            component={SupportChatScreen}
          />
          <Stack.Screen
            name="notes"
            options={{
              headerShown: false,
            }}
            component={NoteScreen}
          />
          <Stack.Screen
            name="notification"
            options={{
              headerShown: false,
            }}
            component={NotificationScreen}
          />
          <Stack.Screen
            name="AcceptInvite"
            options={{
              headerShown: false,
            }}
            component={AcceptInviteScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default MainScreen;
