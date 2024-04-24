import "react-native-gesture-handler";
import { View, Text, StatusBar, Alert } from "react-native";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
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
import { io } from "socket.io-client";
import { setActiveUsers, setSocket } from "../slices/socketSlice";
import { BASE_URL } from "../utils/Endpoints";
import * as Location from "expo-location";

const prefix = Linking.createURL("/accountsgoal-deeplink");
const Stack = createNativeStackNavigator();

const MainScreen = () => {
  const dispatch = useDispatch();
  const linking = {
    prefixes: [prefix, "https://app.accountsgoal.com"],
  };
  const { accountsGoalUser, accountsGoalOrganisation } = useSelector(
    (state) => state.acgUser
  );
  console.log("accountsGoalUser main screen ===> ", accountsGoalUser);
  console.log(
    "accountsGoalOrganisation main screen  ===> ",
    accountsGoalOrganisation
  );
  useEffect(() => {
    let location;
    let socket;
    (async () => {
      // location = await Location.getCurrentPositionAsync({});
      // console.log("location ==> ", location);

      socket = io("http://192.168.253.166:7001");
      // send socket to redux store
      // console.log("socket mainscreen => ", socket);
      // dispatch(setSocket(JSON.stringify(socket)));

      socket.on("connect", () => {
        console.log("user connected to server ===> ", socket.id);
      });

      // emit user id
      socket.emit("connect-user", accountsGoalUser?._id);
      // get connected users
      socket.on("getUsersConnected", (users) => {
        console.log("online users ==>>", users);
        // send connected users to store
        dispatch(setActiveUsers(users));
      });

      // get location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("", "Permission to access location not granted");
        return;
      }
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update location every 5 seconds
          distanceInterval: 10, // Update location when the user moves by 10 meters
        },
        (currentLocation) => {
          // Emit location data to the server
          // emit organisation id so that users in the organisation can send their location
          socket.emit("organisation", {
            organisationId:
              accountsGoalOrganisation && accountsGoalOrganisation?._id,
            userId: accountsGoalUser?._id,
            ...currentLocation,
          });
          // console.log("currentLocation ==> ", currentLocation);
          // location = currentLocation;
        }
      );
      // get connected organisation clients
      socket.on("users-count", (count) => {
        console.log("connected organisation clients ===> ", count);
      });
      // listen to organisation id event
      socket.on(
        accountsGoalOrganisation && accountsGoalOrganisation?._id,
        (organisation) => {}
      );
      // add the array of object to connected orgainsation slice
    })();
    // Cleanup function
    return () => {
      if (socket) {
        return socket.disconnect();
      }
    };
  }, []);

  return (
    <>
      {/* <StatusBar barStyle={"light-content"} style="auto" /> */}
      <StatusBar barStyle={"light-content"} backgroundColor={"#4169E1"} />

      <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
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
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
export default MainScreen;
