import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  Linking,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import userpng from "../../../assets/user.png";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GoalsScreen from "./GoalsScreen";
import { Path, Svg } from "react-native-svg";
import CustomTextRegular from "../../components/CustomTextRegular";
import MapIcon from "../../Icons/MapIcon";
import GoalIcon from "../../Icons/GoalIcon";
import TodoListIcon from "../../Icons/TodoListIcon";
import CalendarIcon from "../../Icons/CalendarIcon";
import MapScreen from "./MapScreen";
import TodoScreen from "./TodoScreen";
import CreateOrganizationIcon from "../../Icons/CreateOrganizationIcon";
import EditProfileIcon from "../../Icons/EditProfileIcon";
import SupportIcon from "../../Icons/SupportIcon";
import LogoutIcon from "../../Icons/LogoutIcon";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { clearAcgUserData } from "../../slices/userSlice";
import AngleRightIcon from "../../Icons/AngleRightIcon";
import AttachIcon from "../../Icons/AttachIcon";
import { windowHeight } from "../../utils/Dimensions";
import ProfileInfoScreen from "./ProfileInfoScreen";
import { useGetAnOrganizationQuery } from "../../slices/organizationApiSlice";
import TeamsIcon from "../../Icons/TeamsIcon";
import GoogleMeetIcon from "../../Icons/GoogleMeetIcon";
import AppleIcon from "../../Icons/AppleIcon";
import CalendlyIcon from "../../Icons/CalendlyIcon";
import {
  APPLE_CALENDAR_URL,
  CALENDLY_URL,
  GOOGLE_MEET_URL,
  OUTLOOK_URL,
  TEAMS_URL,
} from "../../utils/Endpoints";
import OutlookIcon from "../../Icons/OutlookIcon";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const marginTop = windowHeight * 0.045;

function CustomDrawerContent({ route, ...props }) {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const userId = route?.params?.userId;
  const organizationId = route?.params?.organizationId;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [logout] = useLogoutMutation();

  const handlePress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  const {
    data: accountsGoalOrganisation,
    isLoading: loadingGetOrganisation,
    isError: isGetOrganisationError,
    error: getOrganisationError,
  } = useGetAnOrganizationQuery({
    userId: accountsGoalUser?._id,
  });

  // check if invited user is part of the organisation
  const isAdmin = !accountsGoalUser?.invitedUserId;
  const invitedUser =
    accountsGoalOrganisation &&
    accountsGoalOrganisation?.organization[0]?.invitedUsers?.some(
      (item) => item?.email === accountsGoalUser?.email
    );

  // if user already leaves the organisation then log the user out so that he doesn't have access to admin || client data
  useEffect(() => {
    if (userId && organizationId) {
      if (!isAdmin || !invitedUser) {
        dispatch(clearAcgUserData());
        Alert.alert(
          "",
          "Access denied: You do not belong to this organization.",
          [
            {
              text: "",
              onPress: () => navigation.navigate("signup"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                navigation.navigate("signup");
              },
            },
          ]
        );
      }
    }
  }, [userId, organizationId, isAdmin, invitedUser]);

  // logout user
  const handleLogout = async () => {
    try {
      const res = await logout();

      if (res.data) {
        dispatch(clearAcgUserData());
        navigation.navigate("login");
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  const handleGoToProfileScreen = () => {
    props.navigation.navigate("profileInfo");
    props.navigation.closeDrawer();
  };

  const handleGoToInviteScreen = () => {
    props.navigation.navigate("inviteOthers");
    props.navigation.closeDrawer();
  };

  const handleGoToOrganisationProfileScreen = () => {
    props.navigation.navigate("organizationProfile");
    props.navigation.closeDrawer();
  };

  return (
    <ScrollView className=" flex-1" contentContainerStyle={{ flexGrow: 1 }}>
      {/* profile pic and name */}
      {/* <StatusBar barStyle={"dark-content"} backgroundColor={"#f6f6f6"} /> */}
      <View
        // style={{ height: windowHeight * 0.17 }}
        className="w-full h-[27%] flex flex-row justify-start items-center bg-primary-color px-5 "
      >
        <TouchableOpacity
          onPress={handleGoToProfileScreen}
          style={{ marginTop: -marginTop }}
        >
          {accountsGoalUser?.profileImage ? (
            <Image
              source={{ uri: accountsGoalUser.profileImage }}
              className="h-12 w-12 rounded-full"
            />
          ) : (
            <Image source={userpng} className="h-12 w-12" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleGoToProfileScreen}
          style={{ marginTop: -marginTop }}
        >
          <CustomTextRegular className="ml-5 text-white font-semibold text-sm">
            {accountsGoalUser?.fullName && accountsGoalUser?.fullName}
          </CustomTextRegular>
        </TouchableOpacity>
      </View>
      {/* drawer items */}
      <View
        // style={{ height: windowHeight * 0.64 }}
        className="h-[42%]  rounded-t-2xl -mt-10 flex-1  bg-white-color pt-8"
      >
        {/* <View> */}
        <DrawerContentScrollView {...props} className="">
          <DrawerItemList {...props} />
          {/* custom logout drawitem */}
          {/* support */}
          <TouchableOpacity
            className="flex flex-row items-center  px-5 py-3"
            onPress={() => handlePress("https://www.accountsgoal.com/#faq")}
          >
            <SupportIcon color={"#777777"} />
            <CustomTextRegular className=" text-[#777777] ml-4 text-sm">
              Support
            </CustomTextRegular>
          </TouchableOpacity>
          {/* logout */}
          <TouchableOpacity
            className="flex flex-row items-center  px-5 pt-3 pb-2"
            onPress={handleLogout}
          >
            <LogoutIcon color={"#777777"} />
            <CustomTextRegular className=" text-[#777777] ml-4 text-sm">
              Logout
            </CustomTextRegular>
          </TouchableOpacity>
        </DrawerContentScrollView>
        {/* </View> */}

        {/* horizontal rule */}
        <View className=" w-full h-fit border-b border-b-[#D9D9D9]" />
      </View>
      {/* calendar accounts */}
      <View className="h-[25%] py-4">
        <TouchableOpacity className="flex flex-row items-center px-5 py-3">
          <CalendarIcon color={"#777777"} />
          <CustomTextRegular className="text-[#777777] ml-4 text-sm">
            {accountsGoalUser?.email}
          </CustomTextRegular>
        </TouchableOpacity>
        {/* <TouchableOpacity className="flex flex-row items-center px-5 py-3 ">
          <AddIcon color={"#000"} />
          <CustomTextRegular className="text-[#B9B9B9] ml-6 text-sm">
            name@accountsgoal.com
          </CustomTextRegular>
        </TouchableOpacity> */}
      </View>
      {/* created organisations */}
      <View className="h-[17%] pb-4 overflow-y-scroll">
        {/* create organization */}
        {!loadingGetOrganisation &&
        accountsGoalOrganisation &&
        accountsGoalOrganisation?.organization?.length > 0 ? (
          <View className="flex ">
            <TouchableOpacity
              className=" flex flex-row items-center justify-between px-5 "
              onPress={handleGoToOrganisationProfileScreen}
            >
              <View className="flex flex-row items-center flex-wrap gap-2">
                <CustomTextRegular className="text-base font-bold">
                  {accountsGoalOrganisation &&
                    accountsGoalOrganisation?.organization[0]?.companyName}
                </CustomTextRegular>

                <View className="rounded-2xl  px-2 py-1 bg-[#FFA500]">
                  <CustomTextRegular
                    style={{ borderRadius: 20, borderRadius: 2 }}
                    className="text-xs  text-white"
                  >
                    Organisation
                  </CustomTextRegular>
                </View>
              </View>
              <AngleRightIcon />
            </TouchableOpacity>

            {!accountsGoalUser?.invitedUserId && (
              <TouchableOpacity
                className="flex flex-row bg-[#ECF0FC] mt-3 h-12  items-center px-5"
                onPress={handleGoToInviteScreen}
              >
                <AttachIcon color={"#000"} />
                <CustomTextRegular className="text-black text-sm ml-4">
                  Invite members
                </CustomTextRegular>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity
            className="flex flex-row items-center px-5 bg-[#ECF0FC] h-12"
            onPress={() => navigation.navigate("createOrganization")}
          >
            <CreateOrganizationIcon isActive={false} />
            <CustomTextRegular className=" text-[#777777] ml-4">
              Create Organisation
            </CustomTextRegular>
          </TouchableOpacity>
        )}
      </View>
      {/* {loadingGetOrganisation && (
        <LottieLoadingScreen loading={loadingGetOrganisation} />
      )} */}
    </ScrollView>
  );
}

const DashboardTabs = () => {
  const [toggleCalendarModal, setToggleCalendarModal] = useState(false);

  // toggle media Modal
  const handleToggleCalendarModal = () => {
    setToggleCalendarModal(!toggleCalendarModal);
  };
  const handlePress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  const CalendarModal = () => {
    return (
      <Modal
        animationType="slide"
        visible={toggleCalendarModal}
        transparent={true}
      >
        <View className="h-full w-full flex-1 ">
          <Pressable className="h-[65%]" onPress={handleToggleCalendarModal} />
          {/* <View className="absolute bottom-24 w-full h-[40%] z-20 justify-center items-center bg-screen-bg rounded-t-3xl px-5"> */}
          <View className=" w-full h-[40%] justify-center items-center bg-screen-bg rounded-t-3xl px-5 -mt-16">
            <TouchableOpacity>
              <TeamsIcon />
              <CustomTextRegular className="text-sm">Teams</CustomTextRegular>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "map") {
              return (
                <>
                  <MapIcon color={focused ? "#4169E1" : "#B9B9B9"} />
                  <CustomTextRegular
                    className={`${
                      focused ? "text-primary-color" : "text-[#B9B9B9]"
                    } mt-2 text-sm`}
                  >
                    Map
                  </CustomTextRegular>
                </>
              );
            } else if (route.name === "calendar") {
              return (
                <TouchableOpacity
                  onPress={handleToggleCalendarModal}
                  className="flex flex-col items-center"
                >
                  <CalendarIcon
                    color={
                      focused
                        ? "#4169E1"
                        : toggleCalendarModal
                          ? "#4169E1"
                          : "#B9B9B9"
                    }
                  />
                  <CustomTextRegular
                    className={`${
                      focused || toggleCalendarModal
                        ? "text-primary-color"
                        : "text-[#B9B9B9]"
                    } mt-2 text-sm`}
                  >
                    Calendar
                  </CustomTextRegular>
                </TouchableOpacity>
              );
            } else if (route.name === "todo") {
              return (
                <>
                  <TodoListIcon color={focused ? "#4169E1" : "#B9B9B9"} />
                  <CustomTextRegular
                    className={`${
                      focused ? "text-primary-color" : "text-[#B9B9B9]"
                    } mt-2 text-sm`}
                  >
                    To-do list
                  </CustomTextRegular>
                </>
              );
            } else if (route.name === "goals") {
              return (
                <>
                  <GoalIcon color={focused ? "#4169E1" : "#B9B9B9"} />
                  <CustomTextRegular
                    className={`${
                      focused ? "text-primary-color" : "text-[#B9B9B9]"
                    } mt-2 text-sm`}
                  >
                    Goals
                  </CustomTextRegular>
                </>
              );
            }
          },

          tabBarStyle: {
            backgroundColor: "#fff",
            height: 100,
            paddingVertical: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          },
          headerShown: false,
          tabBarLabel: "",
        })}
      >
        <Tab.Screen name="map" component={MapScreen} />
        <Tab.Screen name="calendar" component={CalendarModal} />
        <Tab.Screen name="todo" component={TodoScreen} />
        <Tab.Screen name="goals" component={GoalsScreen} />
      </Tab.Navigator>

      {toggleCalendarModal ? (
        <Modal
          animationType="slide"
          visible={toggleCalendarModal}
          transparent={true}
        >
          <View className="flex-1 justify-between">
            <Pressable
              className="h-[75%]"
              onPress={handleToggleCalendarModal}
            />
            <View className=" w-full h-[30%]  bg-screen-bg rounded-t-3xl px-7 py-5 -mt-16 ">
              {/* calendly */}
              <TouchableOpacity
                className="flex flex-row items-center mt-4"
                onPress={() => handlePress(CALENDLY_URL)}
              >
                <CalendlyIcon />
                <CustomTextRegular className="text-sm  ml-4">
                  Calendly
                </CustomTextRegular>
              </TouchableOpacity>
              {/* google meet */}
              <TouchableOpacity
                className="flex flex-row items-center mt-4"
                onPress={() => handlePress(GOOGLE_MEET_URL)}
              >
                <GoogleMeetIcon />
                <CustomTextRegular className="text-sm ml-4">
                  Google meet
                </CustomTextRegular>
              </TouchableOpacity>
              {/* outlook */}
              <TouchableOpacity
                className="flex flex-row items-center mt-4"
                onPress={() => handlePress(OUTLOOK_URL)}
              >
                <OutlookIcon />
                <CustomTextRegular className="text-sm  ml-4">
                  Outlook
                </CustomTextRegular>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex flex-row items-center mt-4"
                onPress={() => handlePress(TEAMS_URL)}
              >
                <TeamsIcon />
                <CustomTextRegular className="text-sm  ml-4">
                  Teams
                </CustomTextRegular>
              </TouchableOpacity>

              {/* <TouchableOpacity
                className="flex flex-row items-center mt-4"
                onPress={() => handlePress(APPLE_CALENDAR_URL)}
              >
                <AppleIcon />
                <CustomTextRegular className="text-sm  ml-4">
                  Apple
                </CustomTextRegular>
              </TouchableOpacity> */}
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

const HomeScreen = ({ navigation, route }) => {
  return (
    <>
      <Drawer.Navigator
        style={{ flex: 1 }}
        drawerContent={(props) => (
          <CustomDrawerContent route={route} {...props} />
        )}
        screenOptions={{
          drawerLabelStyle: {
            color: "#777777",
            borderBottomColor: "#fff",
          },
          drawerItemStyle: {
            paddingHorizontal: 12,
            paddingVertical: 0,
            marginHorizontal: 0,
          },
          drawerActiveBackgroundColor: "#ECF0FC",
        }}
      >
        <Drawer.Screen
          name="hometab"
          options={{
            headerShown: false,
            // headerTransparent: true,
            headerTintColor: "#fff",
            headerStyle: {},
            // headerRight: () => CustomHeaderRight("#C5DEFB"),

            drawerIcon: ({ focused }) => (
              <Svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M20.5153 9.72831L13.0153 2.65206C13.0116 2.64886 13.0082 2.64541 13.005 2.64175C12.7289 2.39062 12.369 2.25146 11.9958 2.25146C11.6225 2.25146 11.2627 2.39062 10.9866 2.64175L10.9763 2.65206L3.48469 9.72831C3.33187 9.86883 3.20989 10.0395 3.12646 10.2296C3.04303 10.4197 2.99997 10.6251 3 10.8327V19.4999C3 19.8977 3.15804 20.2792 3.43934 20.5605C3.72064 20.8418 4.10218 20.9999 4.5 20.9999H9C9.39782 20.9999 9.77936 20.8418 10.0607 20.5605C10.342 20.2792 10.5 19.8977 10.5 19.4999V14.9999H13.5V19.4999C13.5 19.8977 13.658 20.2792 13.9393 20.5605C14.2206 20.8418 14.6022 20.9999 15 20.9999H19.5C19.8978 20.9999 20.2794 20.8418 20.5607 20.5605C20.842 20.2792 21 19.8977 21 19.4999V10.8327C21 10.6251 20.957 10.4197 20.8735 10.2296C20.7901 10.0395 20.6681 9.86883 20.5153 9.72831ZM19.5 19.4999H15V14.9999C15 14.602 14.842 14.2205 14.5607 13.9392C14.2794 13.6579 13.8978 13.4999 13.5 13.4999H10.5C10.1022 13.4999 9.72064 13.6579 9.43934 13.9392C9.15804 14.2205 9 14.602 9 14.9999V19.4999H4.5V10.8327L4.51031 10.8233L12 3.74987L19.4906 10.8214L19.5009 10.8308L19.5 19.4999Z"
                  fill="#8DADD2"
                />
              </Svg>
            ),
            drawerLabel: ({ focused }) => (
              <CustomTextRegular
                style={{ color: focused ? "black" : "#777777" }}
                className="text-sm -ml-4"
              >
                Home
              </CustomTextRegular>
            ),
          }}
          component={DashboardTabs}
        />
        <Drawer.Screen
          name="editProfile"
          options={{
            drawerIcon: ({ focused }) => (
              <EditProfileIcon color={focused ? "black" : "#777777"} />
            ),

            drawerLabel: ({ focused }) => (
              <CustomTextRegular
                style={{ color: focused ? "black" : "#777777" }}
                className="text-sm -ml-4"
              >
                Edit profile
              </CustomTextRegular>
            ),
            headerShown: false,
          }}
          component={ProfileInfoScreen}
        />
      </Drawer.Navigator>
    </>
  );
};
export default HomeScreen;

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: "#79B45D",
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: "#33373B",
  },
});
