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
                  // title={item.ACCOUNT_NAME}
                  // description={item.REVENUE}
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
                onPress={handleImportExcelFIle}
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
      {(uploadingFile || loadingExcelData) && (
        <LottieLoadingScreen loading={uploadingFile || loadingExcelData} />
      )}
    </SafeAreaView>
  );
};

export default MapScreen;
