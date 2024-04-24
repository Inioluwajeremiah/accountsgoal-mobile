import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Settings,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import userpng from "../../../assets/user.png";
import MenuIcon from "../../Icons/MenuIcon";
import {
  DrawerContentScrollView,
  DrawerItem,
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
import CalendarScreen from "./CalendarScreen";
import TodoScreen from "./TodoScreen";
import CreateOrganizationIcon from "../../Icons/CreateOrganizationIcon";
import EditProfileIcon from "../../Icons/EditProfileIcon";
import SupportIcon from "../../Icons/SupportIcon";
import SettingsIcon from "../../Icons/SettingsIcon";
import LogoutIcon from "../../Icons/LogoutIcon";
import AddIcon from "../../Icons/AddIcon";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { clearAcgUserData } from "../../slices/userSlice";
import AngleRightIcon from "../../Icons/AngleRightIcon";
import AttachIcon from "../../Icons/AttachIcon";
import { windowHeight } from "../../utils/Dimensions";
import ProfileInfoScreen from "./ProfileInfoScreen";
import SupportScreen from "./SupportScreen";
import SettingsScreen from "./SettingsScreen";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const marginTop = windowHeight * 0.045;

function CustomDrawerContent(props) {
  const { accountsGoalUser, accountsGoalOrganisation } = useSelector(
    (state) => state.acgUser
  );
  console.log(
    "accountsGoalOrganisation home screen ==> ",
    accountsGoalOrganisation
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [logout] = useLogoutMutation();
  const organization = false;

  // logout user
  const handleLogout = async () => {
    try {
      const res = await logout();
      console.log("logout response ===> ", res);
      if (res.data) {
        navigation.navigate("login");
        dispatch(clearAcgUserData());
      }
    } catch (error) {
      console.log(error);

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
        className="w-full h-[25%] flex flex-row justify-start items-center bg-primary-color px-5 "
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
            {accountsGoalUser?.fullName
              ? accountsGoalUser?.fullName
              : "Jane Doe"}
          </CustomTextRegular>
        </TouchableOpacity>
      </View>
      {/* drawer items */}
      <View
        // style={{ height: windowHeight * 0.64 }}
        className="h-[45%]  rounded-t-2xl -mt-10 flex-1  bg-white-color pt-8"
      >
        {/* <View> */}
        <DrawerContentScrollView {...props} className="">
          <DrawerItemList {...props} />
          {/* custom logout drawitem */}
          <TouchableOpacity
            className="flex flex-row items-center  px-5 py-2"
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
            Nicholas@gloration.com
          </CustomTextRegular>
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row items-center px-5 py-3 ">
          <AddIcon color={"#000"} />
          <CustomTextRegular className="text-[#B9B9B9] ml-6 text-sm">
            Nicholas@gloration.com
          </CustomTextRegular>
        </TouchableOpacity>
      </View>
      {/* created organisations */}
      <View className="h-[15%] pb-4">
        {/* create organization */}
        {accountsGoalOrganisation ? (
          <View className="flex fl ">
            <TouchableOpacity
              className=" flex flex-row items-center justify-between px-5 "
              onPress={handleGoToOrganisationProfileScreen}
            >
              <View className="flex flex-row items-center">
                <CustomTextRegular className="text-base font-bold">
                  {accountsGoalOrganisation.companyName}
                </CustomTextRegular>
                <CustomTextRegular className="text-xs rounded-2xl ml-2  px-2 py-1 bg-[#FFA500] text-white">
                  Organisation
                </CustomTextRegular>
              </View>
              <AngleRightIcon />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex flex-row bg-[#ECF0FC] mt-3 h-12 items-center px-5"
              onPress={handleGoToInviteScreen}
            >
              <AttachIcon color={"#000"} />
              <CustomTextRegular className="text-black text-sm ml-4">
                Invite members
              </CustomTextRegular>
            </TouchableOpacity>
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
    </ScrollView>
  );
}

const DashboardTabs = () => {
  const [toggleMediaDialog, setToggleMediaDialog] = useState(false);

  // toggle media dialog
  const handleToggleMediaDialog = () => {
    setToggleMediaDialog(!toggleMediaDialog);
  };
  return (
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
              <>
                <CalendarIcon color={focused ? "#4169E1" : "#B9B9B9"} />
                <CustomTextRegular
                  className={`${
                    focused ? "text-primary-color" : "text-[#B9B9B9]"
                  } mt-2 text-sm`}
                >
                  Calendar
                </CustomTextRegular>
              </>
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
          height: 104,
        },
        headerShown: false,
        tabBarLabel: "",
      })}
    >
      <Tab.Screen name="map" component={MapScreen} />
      <Tab.Screen name="calendar" component={CalendarScreen} />
      <Tab.Screen name="todo" component={TodoScreen} />
      <Tab.Screen name="goals" component={GoalsScreen} />
    </Tab.Navigator>
  );
};

const HomeScreen = ({ navigation }) => {
  // const { accountsGoalUser } = useSelector((state) => state.acgUser);
  return (
    <>
      <Drawer.Navigator
        style={{ flex: 1 }}
        // initialRouteName=""
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        <Drawer.Screen
          name="support"
          component={SupportScreen}
          options={{
            drawerIcon: ({ focused }) => (
              <SupportIcon color={focused ? "black" : "#777777"} />
            ),
            drawerLabel: ({ focused }) => (
              <CustomTextRegular
                style={{ color: focused ? "black" : "#777777" }}
                className="text-sm -ml-4"
              >
                Support
              </CustomTextRegular>
            ),
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="settings"
          component={SettingsScreen}
          options={{
            drawerIcon: ({ focused }) => (
              <SettingsIcon color={focused ? "black" : "#777777"} />
            ),
            drawerLabel: ({ focused }) => (
              <CustomTextRegular
                style={{ color: focused ? "black" : "#777777" }}
                className="text-sm -ml-4"
              >
                Settings
              </CustomTextRegular>
            ),
            headerShown: false,
          }}
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
