import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import MenuIcon from "../../Icons/MenuIcon";
import FilterIcon from "../../Icons/FilterIcon";
import MapView, { Callout, GOOGLE_PROVIDER, Marker } from "react-native-maps";
import { windowHeight, windowWidth } from "../../utils/Dimensions";
import AddIcon from "../../Icons/AddIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import { useDispatch, useSelector } from "react-redux";
import ExcelFIleIcon from "../../Icons/ExcelFIleIcon";
import { setImportFile } from "../../slices/userSlice";
import * as DocumentPicker from "expo-document-picker";
import { BASE_URL } from "../../utils/Endpoints";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { useGetExcelDataQuery } from "../../slices/accountApiSlice";
import * as Location from "expo-location";
import MarkerIcon from "../../Icons/MarkerIcon";
import CaretDown from "../../Icons/CaretDown";
import GoalIcon from "../../Icons/GoalIcon";
import AngleRightIcon from "../../Icons/AngleRightIcon";
import TodoListIcon from "../../Icons/TodoListIcon";
import ContactIcon from "../../Icons/ContactIcon";
import CloseButton from "../../Icons/CloseButton";
import EmailIcon from "../../Icons/EmailIcon";
import UserIcon from "../../Icons/UserIcon";
import DobIcon from "../../Icons/DobIcon";
import PhoneBookIcon from "../../Icons/PhoneBookIcon";
import EditTodoIcon from "../../Icons/EditTodoIcon";

const dataToUpload = [
  "Account name",
  "Address",
  "Revenue then other informations",
];
const StatusBarHeight = StatusBar.currentHeight;

const MapScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { accountsGoalUser, importFile } = useSelector(
    (state) => state.acgUser
  );
  const {
    data: excelData,
    isLoading: loadingExcelData,
    isError: isExcelrror,
    error: excelDataError,
  } = useGetExcelDataQuery({
    userId: accountsGoalUser._id,
    token: accountsGoalUser.token,
  });

  const [toggleModal, setToggleModal] = useState(false);
  const [toggleInitialFIleImport, setToggleInitialFIleImport] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [showToolTip, setShowToolTip] = useState(false);
  const [showPreviewAccount, setShowPreviewAccount] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTakeActionModal, setShowTakeActionModal] = useState(false);

  const isValidForm = true;
  const loadingUploadExcelFile = false;

  console.log("importFile ==> ", importFile);
  console.log("accountsGoalUser ==> ", accountsGoalUser);
  console.log(
    "excelData ==> ",
    excelData && typeof excelData[0].data[0].ADDRESS.split(",")[1]
  );
  console.log("isExcelrror ==> ", isExcelrror);
  console.log("excelDataError ==> ", excelDataError);
  console.log("longitude ==> ", typeof longitude);
  console.log("latitude ==> ", latitude);

  const handleToggleImportExcelFile = () => {
    setToggleModal(!toggleModal);
  };
  const handleToggleInitialFIleImport = () => {
    dispatch(setImportFile({ importFile: true }));
    setToggleInitialFIleImport(false);
  };

  const handleGetStarted = () => {
    setToggleModal(true);
  };

  const handleImportExcelFIle = async () => {
    setToggleInitialFIleImport(false);
    setToggleModal(false);
    try {
      const pickedFile = await DocumentPicker.getDocumentAsync({
        type: [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (pickedFile?.type?.canceled || pickedFile?.canceled) {
        console.log("Document picking canceled or failed.");
      } else {
        console.log("excel pickedFile 2 =>", pickedFile);
        await uploadFile(pickedFile.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  // upload file to server
  const uploadFile = async (excelFile) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "multipart/form-data");
    myHeaders.append("Authorization", `Bearer ${accountsGoalUser.token}`);
    const time = new Date().getTime();
    const fileName = `${accountsGoalUser._id + time}.${excelFile.uri.split(".")[3]}`;
    const formfile = {
      uri: excelFile.uri,
      type: excelFile.mimeType,
      name: fileName,
    };
    const formdata = new FormData();
    formdata.append("file", formfile);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    setUploadingFile(true);
    fetch(`${BASE_URL}/upload_excel`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("upload excel result ==> ", result);
        if (result === "Excel data uploaded successfully.") {
          Alert.alert("", "Excel data uploaded successfully");
          handleToggleInitialFIleImport();
        }
        setUploadingFile(false);
      })
      .catch((error) => {
        console.error("upload error ===> ", error);
        setUploadingFile(false);
      });
  };

  const toggleTooltip = () => {
    setShowToolTip(!showToolTip);
  };

  const handelToggleAccountPreview = () => {
    setShowPreviewAccount(!showPreviewAccount);
  };
  const handleOnPressMarker = (item) => {
    setCurrentItem(item);
    handelToggleAccountPreview();
  };

  const handleToggleContactModal = () => {
    setShowContactModal(!showContactModal);
    setShowPreviewAccount(false);
    setShowTakeActionModal(false);
  };
  const handleToggleTakeActionModal = () => {
    setShowTakeActionModal(!showTakeActionModal);
    setShowContactModal(false);
    setShowPreviewAccount(false);
  };

  useEffect(() => {
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update location every 5 seconds
        distanceInterval: 10, // Update location when the user moves by 10 meters
      },
      (currentLocation) => {
        setLatitude(currentLocation.coords.latitude);
        setLongitude(currentLocation.coords.longitude);

        console.log("currentLocation ==> ", currentLocation);
        // location = currentLocation;
      }
    );
  }, []);
  return (
    <SafeAreaView className="flex-1">
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={GOOGLE_PROVIDER}
        showsUserLocation
        showsMyLocationButton
        // initialRegion={{
        //   latitude: 7.50771,
        //   longitude: 3.9151721,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
      >
        {/* <Marker
          coordinate={{
            latitude: 7.50771,
            longitude: 3.9151721,
          }}
          onPress={toggleTooltip}
          
        >
          <View className="relative w-10 h-10 rounded-full bg-primary-color flex items-center justify-center">
            <MarkerIcon />
          </View>
          
          <Callout tooltip={true} style={{ width: 120, height: 45 }}>
            <View className="relative w-full h-9 rounded-xl bg-primary-color flex flex-col items-center justify-center ">
              <CustomTextRegular className="text-white text-center text-[8px] p-2">
                {accountsGoalUser.fullName}
              </CustomTextRegular>
              <View className="-mb-3 ">
                <CaretDown />
              </View>
            </View>
          </Callout>
        </Marker> */}
        {/* {excelData &&
          excelData.map((user, index) => (
            <View key={index}>
              {user.data.map((item, key) => (
                <Marker
                  key={key}
                  coordinate={{
                    latitude: item.ADDRESS.split(",")[0],
                    longitude: item.ADDRESS.split(",")[1],
                  }}
                  title={item.ACCOUNT_NAME}
                  description={item.REVENUE}
                >
                  <MarkerIcon />
                </Marker>
              ))}
            </View>
          ))} */}
        {excelData &&
          excelData.map((user, index) => (
            <View key={index}>
              {user.data.map((item, key) => (
                <Marker
                  key={key}
                  coordinate={{
                    latitude: parseFloat(item.ADDRESS.split(",")[0].trim()),
                    longitude: parseFloat(item.ADDRESS.split(",")[1].trim()),
                  }}
                  onPress={() => handleOnPressMarker(item)}
                >
                  <View className="relative w-10 h-10 rounded-full bg-primary-color flex items-center justify-center">
                    <MarkerIcon />
                  </View>

                  <Callout tooltip={true} style={{ width: 120, height: 45 }}>
                    <View className="relative w-full h-9 rounded-xl bg-primary-color flex flex-col items-center justify-center ">
                      <CustomTextRegular className="text-white text-center text-[8px] p-2">
                        {/* {item.ADDRESS.split(",")[0].trim()} */}
                        {item.ACCOUNT_NAME}
                      </CustomTextRegular>
                      {/* <CustomTextRegular className="text-white text-center text-[8px] p-2">
                        {item.ADDRESS.split(",")[1].trim()}
                      </CustomTextRegular> */}
                      <View className="-mb-3 ">
                        <CaretDown />
                      </View>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </View>
          ))}
      </MapView>

      {/* menu icon and filter */}
      <View className=" absolute top-4 flex flex-row items-center px-5 mt-4 ">
        {/* menu */}
        <TouchableOpacity
          className="h-12 w-12 rounded-full bg-white flex flex-row justify-center items-center  mr-4 "
          onPress={() => navigation.openDrawer()}
        >
          <MenuIcon />
        </TouchableOpacity>

        <View className="w-full flex-1  flex flex-row items-center justify-between bg-white rounded-full  ">
          <TextInput
            placeholder="Search account name"
            className="  p-3 text-sm text-border-color "
            placeholderTextColor={"#A8A8A8"}
            cursorColor={"#A8A8A8"}
          />
          <TouchableOpacity className=" p-3 ">
            <FilterIcon />
          </TouchableOpacity>
        </View>
      </View>
      {/* add icon */}
      <TouchableOpacity
        className="absolute right-10 bottom-10 w-[60px] h-[60px] rounded-full bg-primary-color flex items-center justify-center"
        onPress={handleToggleImportExcelFile}
      >
        <AddIcon color={"#fff"} />
      </TouchableOpacity>

      {/******************** upload excel file modal *************************/}
      {toggleModal && (
        <Modal transparent={true} visible={toggleModal} animationType="none">
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full bg-black/50 "
          >
            <Pressable
              className="h-[50%] "
              onPress={handleToggleImportExcelFile}
            />

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
              }}
              className="px-5  w-full h-[55%] flex flex-col  rounded-t-3xl  bg-screen-bg"
            >
              <View className="py-10 ">
                <CustomTextRegular className="font-black leading-6 text-base text-black mb-6">
                  Please make sure each excel files as the following vaules
                </CustomTextRegular>
                {dataToUpload.map((item, index) => (
                  <View
                    className="py-1 flex flex-row items-center  "
                    key={index}
                  >
                    <View className="h-1 w-1 bg-black rounded-full mr-2" />
                    <CustomTextRegular className="text-sm text-black ">
                      {item}
                    </CustomTextRegular>
                  </View>
                ))}
              </View>
              {/* upload excel file button */}
              <TouchableOpacity
                style={{
                  borderStyle: "dashed",
                  borderWidth: 1,
                  borderColor: "#4169E1",
                }}
                className={`bg-[#C4D1F6] rounded-full mt-4 h-12 py-3 flx justify-center items-center mb-10  `}
                disabled={false}
                onPress={handleImportExcelFIle}
              >
                <CustomTextRegular className="text-center font-semibold text-primary-color text-base">
                  {loadingUploadExcelFile ? (
                    <ActivityIndicator size="small" color={"#fff"} />
                  ) : (
                    "Upload document (.xml format)"
                  )}
                </CustomTextRegular>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/******************** intial: upload excel file modal *************************/}
      {!importFile && toggleInitialFIleImport && (
        <Modal
          transparent={true}
          visible={toggleInitialFIleImport}
          animationType="none"
        >
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full bg-black/50 "
          >
            <View
              className="h-[40%] "
              // onPress={handleToggleInitialFIleImport}
            />

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
              }}
              className="px-5  w-full h-[65%] flex flex-col  rounded-t-3xl  bg-screen-bg"
            >
              <View className="py-10 flex flex-col items-center justify-center ">
                <ExcelFIleIcon />
                <CustomTextRegular className="font-black leading-6 text-xl text-black my-6">
                  Import Data
                </CustomTextRegular>
                <CustomTextRegular className="text-sm text-center">
                  {
                    "Easily import your account data from Excel for\n streamlined account management."
                  }
                </CustomTextRegular>
              </View>
              {/* get started button */}
              <TouchableOpacity
                className={`bg-primary-color rounded-full mt-4 h-12 py-3 flx justify-center items-center mb-4  `}
                disabled={false}
                onPress={handleGetStarted}
              >
                <CustomTextRegular className="text-center font-semibold text-white text-base">
                  {loadingUploadExcelFile ? (
                    <ActivityIndicator size="small" color={"#fff"} />
                  ) : (
                    "Get Started"
                  )}
                </CustomTextRegular>
              </TouchableOpacity>

              {/* skip for now button */}
              <TouchableOpacity
                className={` rounded-full mt-4 h-12 py-3 flx justify-center items-center  mb-10 `}
                disabled={false}
                onPress={handleToggleInitialFIleImport}
              >
                <CustomTextRegular className="text-center text-primary-accent-color text-sm">
                  {loadingUploadExcelFile ? (
                    <ActivityIndicator size="small" color={"#fff"} />
                  ) : (
                    "Skip for now >>>"
                  )}
                </CustomTextRegular>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/******************** show preview account *************************/}
      {showPreviewAccount && (
        <Modal
          transparent={true}
          visible={showPreviewAccount}
          animationType="none"
        >
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full bg-black/50 "
          >
            <Pressable
              className="h-[35%] "
              onPress={handelToggleAccountPreview}
            />

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
              }}
              className="px-5  w-full h-[70%] flex flex-col  rounded-t-3xl  bg-screen-bg"
            >
              <View className="py-6 ">
                <TouchableOpacity
                  className=" w-8 h-8 flex self-end items-center justify-center  p-2"
                  onPress={handelToggleAccountPreview}
                >
                  <View className="w-6 h-6 rounded-full flex items-center justify-center border border-[#A8A8A8]">
                    <CloseButton color={"#A8A8A8"} />
                  </View>
                </TouchableOpacity>
                <CustomTextRegular className="font-black leading-6 text-base text-black mb-6">
                  {currentItem.ACCOUNT_NAME}
                </CustomTextRegular>
                {/* tags */}
                <View className="flex flex-row justify-between">
                  {/* left view */}
                  <View>
                    <CustomTextRegular className="text-xs ">
                      Last Interaction:{" "}
                    </CustomTextRegular>
                    <View className="flex flex-row items-center">
                      <CustomTextRegular className="text-sm font-black mt-2">
                        51 days ago
                      </CustomTextRegular>
                      <View className="rounded-full w-fit bg-orange px-2 py-1 ml-2 mt-2">
                        <CustomTextRegular className="text-[10px] font-bold text-white ">
                          Video call
                        </CustomTextRegular>
                      </View>
                    </View>
                  </View>
                  {/* right view */}
                  <View>
                    <CustomTextRegular className="text-xs ">
                      Revenue
                    </CustomTextRegular>
                    <CustomTextRegular className="text-sm font-black">
                      $400,000
                    </CustomTextRegular>
                  </View>
                </View>
                {/* note */}
                <CustomTextRegular className="text-xs text-primary-accent-color leading-5 mt-4">
                  Recently updated with the latest transactional data for
                  enhanced accuracy in sales tracking and performance analysis
                  on the 5th March 2024...
                </CustomTextRegular>
                {/* goal card */}
                <TouchableOpacity className="w-full relative flex flex-row items-top  mt-4">
                  {/* goal icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <GoalIcon color={"#4169E1"} />
                  </View>
                  {/* goal title and text */}
                  <View className="w-[75%] ml-4">
                    <CustomTextRegular>Goal</CustomTextRegular>
                    <CustomTextRegular className="text-xs text-primary-accent-color">
                      Increase revenue generated, 13 interaction with clients,
                      Upgrade account.
                    </CustomTextRegular>
                  </View>
                  {/* angle right icon */}
                  <TouchableOpacity className="absolute right-0 top-0">
                    <AngleRightIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
                {/* todo list card */}
                <TouchableOpacity className="w-full relative flex flex-row items-top  mt-4">
                  {/* goal icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <TodoListIcon color={"#4169E1"} />
                  </View>
                  {/* goal title and text */}
                  <View className="w-[75%] ml-4">
                    <CustomTextRegular>To do list</CustomTextRegular>
                    <CustomTextRegular className="text-xs text-primary-accent-color">
                      Increase revenue generated, 13 interaction with clients,
                      Upgrade account.
                    </CustomTextRegular>
                  </View>
                  {/* angle right icon */}
                  <TouchableOpacity className="absolute right-0 top-0">
                    <AngleRightIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
              {/* buttons */}
              <View className="flex flex-row items-center justify-between">
                {/* take an action button */}
                <TouchableOpacity
                  className={`w-[80%] bg-primary-color rounded-full mt-4 h-12 py-3 flx justify-center items-center mb-10  `}
                  disabled={false}
                  onPress={handleToggleTakeActionModal}
                >
                  <CustomTextRegular className="text-center font-semibold text-white text-base">
                    {loadingUploadExcelFile ? (
                      <ActivityIndicator size="small" color={"#fff"} />
                    ) : (
                      "Take an action"
                    )}
                  </CustomTextRegular>
                </TouchableOpacity>
                {/* contact button */}
                <TouchableOpacity
                  className={`w-12 h-12 bg-primary-color rounded-full mt-4 py-3 flx justify-center items-center mb-10  `}
                  disabled={false}
                  onPress={handleToggleContactModal}
                >
                  <ContactIcon />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/******************** take action *************************/}
      {showTakeActionModal && (
        <Modal
          transparent={true}
          visible={showTakeActionModal}
          animationType="none"
        >
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full bg-black/50 "
          >
            <Pressable
              className="h-[60%] "
              onPress={handleToggleTakeActionModal}
            />

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
              }}
              className="px-5  w-full h-[45%] flex flex-col  rounded-t-3xl  bg-screen-bg"
            >
              <View className="py-6 ">
                {/* note card */}
                <TouchableOpacity className="w-full relative flex flex-row items-top  mt-6">
                  {/* note icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <EditTodoIcon color={"#4169E1"} />
                  </View>
                  {/* note title and text */}
                  <View className="w-[75%] ml-4">
                    <CustomTextRegular>Edit notes</CustomTextRegular>
                    <CustomTextRegular className="text-xs text-primary-accent-color">
                      Update details quickly and easily.
                    </CustomTextRegular>
                  </View>
                  {/* angle right icon */}
                  <TouchableOpacity className="absolute right-0 top-0">
                    <AngleRightIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
                {/* goal card */}
                <TouchableOpacity className="w-full relative flex flex-row items-top  mt-6">
                  {/* goal icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <GoalIcon color={"#4169E1"} />
                  </View>
                  {/* goal title and text */}
                  <View className="w-[75%] ml-4">
                    <CustomTextRegular>Set goals</CustomTextRegular>
                    <CustomTextRegular className="text-xs text-primary-accent-color">
                      Set goals to stay focused and drive performance.
                    </CustomTextRegular>
                  </View>
                  {/* angle right icon */}
                  <TouchableOpacity className="absolute right-0 top-0">
                    <AngleRightIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
                {/* todo list card */}
                <TouchableOpacity className="w-full relative flex flex-row items-top  mt-6">
                  {/* todo icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <TodoListIcon color={"#4169E1"} />
                  </View>
                  {/* todo title and text */}
                  <View className="w-[75%] ml-4">
                    <CustomTextRegular>Add to do list</CustomTextRegular>
                    <CustomTextRegular className="text-xs text-primary-accent-color">
                      Track and prioritize activities effectively
                    </CustomTextRegular>
                  </View>
                  {/* angle right icon */}
                  <TouchableOpacity className="absolute right-0 top-0">
                    <AngleRightIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/******************** contact modal *************************/}
      {showContactModal && (
        <Modal
          transparent={true}
          visible={showContactModal}
          animationType="none"
        >
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full bg-black/50 "
          >
            <Pressable
              className="h-[50%] "
              onPress={handleToggleContactModal}
            />

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
              }}
              className="px-5  w-full h-[55%] flex flex-col  rounded-t-3xl  bg-screen-bg"
            >
              <View className="py-6 ">
                <CustomTextRegular className="font-black leading-6 text-base text-black mb-6">
                  {"Contact Information"}
                </CustomTextRegular>

                {/* list of contact details  */}

                <View className="w-full  flex flex-row items-center  mt-4">
                  {/*  icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <UserIcon color={"#4169E1"} />
                  </View>
                  <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                    {currentItem.ACCOUNT_NAME}
                  </CustomTextRegular>
                </View>
                <View className="w-full  flex flex-row items-center  mt-4">
                  {/*  icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <EmailIcon color={"#4169E1"} />
                  </View>
                  <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                    {"baylor@irving.com Scott@irving.com"}
                  </CustomTextRegular>
                </View>
                <View className="w-full  flex flex-row items-center  mt-4">
                  {/*  icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <DobIcon color={"#4169E1"} />
                  </View>
                  <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                    {"20 December 2001"}
                  </CustomTextRegular>
                </View>
                <View className="w-full  flex flex-row items-center  mt-4">
                  {/*  icon */}
                  <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                    <PhoneBookIcon color={"#4169E1"} />
                  </View>
                  <CustomTextRegular className="text-xs text-primary-accent-color ml-4">
                    {"Baylor- +16212233242"}
                  </CustomTextRegular>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      )}

      {(uploadingFile || loadingExcelData) && (
        <LottieLoadingScreen loading={uploadingFile || loadingExcelData} />
      )}
    </SafeAreaView>
  );
};

export default MapScreen;
