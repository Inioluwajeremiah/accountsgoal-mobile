import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import MenuIcon from "../../Icons/MenuIcon";
import MapView, { Callout, GOOGLE_PROVIDER, Marker } from "react-native-maps";
import AddIcon from "../../Icons/AddIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import { useDispatch, useSelector } from "react-redux";
import ExcelFIleIcon from "../../Icons/ExcelFIleIcon";
import { setImportFile } from "../../slices/userSlice";
import * as DocumentPicker from "expo-document-picker";
import { BASE_URL } from "../../utils/Endpoints";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { useGetExcelDataQuery } from "../../slices/accountApiSlice";
import MarkerIcon from "../../Icons/MarkerIcon";
import CaretDown from "../../Icons/CaretDown";
import MapTakeActionModal from "./dashboardComponents/MapTakeActionModal";
import MapContactModal from "./dashboardComponents/MapContactModal";
import MapPreviewAccountModal from "./dashboardComponents/MapPreviewAccountModal";
import SearchMap from "./SearchMap";
import * as FileSystem from "expo-file-system";
import { shareAsync } from "expo-sharing";
import ExcelIcon from "../../Icons/ExcelIcon";
import { status_bar_height } from "../../utils/Dimensions";

const dataToUpload = [
  "ACCOUNT_NAME",
  "ADDRESS",
  "CELEBRATIONS",
  "EMAIL",
  "MOBILE_CONTACT",
  "REVENUE",
];
const StatusBarHeight = StatusBar.currentHeight;

const MapScreen = ({ navigation, route }) => {
  // const userId = route?.params?.userId;
  // const organizationId = route?.params?.organizationId;

  const dispatch = useDispatch();
  const { accountsGoalUser, importFile, userId, organizationId } = useSelector(
    (state) => state.acgUser
  );
  const isAdmin = !accountsGoalUser?.invitedUserId;
  const {
    data: initialExcelData,
    isLoading: loadingExcelData,
    isError: isExcelrror,
    error: excelDataError,
    refetch: refetchExcelData,
  } = useGetExcelDataQuery({
    userId: accountsGoalUser?._id || userId,
    token: accountsGoalUser?.token,
  });

  const initialRegion = {
    latitude: 37.78825, // Initial latitude for the map view
    longitude: -122.4324, // Initial longitude for the map view
    latitudeDelta: 1, // Zoom level, smaller means higher zoom
    longitudeDelta: 1, // Zoom level, smaller means higher zoom
  };

  const calloutRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleInitialFIleImport, setToggleInitialFIleImport] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);
  const [showPreviewAccount, setShowPreviewAccount] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);
  const [showTakeActionModal, setShowTakeActionModal] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [excelData, setExcelData] = useState([]);

  const isValidForm = true;
  const loadingUploadExcelFile = false;

  const downloadFile = async () => {
    const downloadResumable = FileSystem.createDownloadResumable(
      "https://www.accountsgoal.com/excel_template.xlsx",
      // "https://res.cloudinary.com/deyfxmnmv/raw/upload/v1719605312/sample_clj8mw_g87sjb.xlsx",
      FileSystem.documentDirectory + "accountsgoal_excel_sample.xlsx",
      {},
      null //download call back here. download call back can be used to determine download progress
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      saveFile(
        uri,
        "accountsgoal_excel_sample.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    } catch (e) {
      console.error(e);
    }
  };
  const saveFile = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          mimetype
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        shareAsync(uri);
      }
    } else {
      shareAsync(uri);
    }
  };

  const downloadExcelFile = async () => {
    try {
      // Fetch the file from the cloud
      const response = await fetch(
        "https://www.accountsgoal.com/excel_template.xlsx"
      );
      const blob = await response.blob();

      // Get the binary data from the blob
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result.split(",")[1]; // Extract base64 part

        // Define the file path
        const filePath =
          FileSystem.documentDirectory + "accountsgoal_excel_sample.xlsx";

        // Save the file
        await FileSystem.writeAsStringAsync(filePath, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log("File saved successfully:", filePath);
      };
      reader.readAsDataURL(blob); // Convert blob to base64
    } catch (error) {
      console.error("Error downloading and saving file:", error);
    }
  };

  const handleToggleImportExcelFile = () => {
    setToggleModal(!toggleModal);
  };
  const handleToggleInitialFIleImport = () => {
    dispatch(setImportFile({ importFile: true }));
    setToggleInitialFIleImport(false);
  };

  const handleGetStarted = () => {
    dispatch(setImportFile({ importFile: true }));
    setToggleModal(true);
    setToggleInitialFIleImport(false);
  };

  const handleImportExcelFIle = async () => {
    setToggleInitialFIleImport(false);
    // setToggleModal(false);
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
    myHeaders.append("Authorization", `Bearer ${accountsGoalUser?.token}`);
    const time = new Date().getTime();
    const fileName = `${accountsGoalUser?._id + time}.${excelFile.uri.split(".")[3]}`;
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
        if (result === "Excel data uploaded successfully.") {
          refetchExcelData();
          Alert.alert("", "Excel data uploaded successfully");
          handleToggleInitialFIleImport();
          setUploadingFile(false);
        }
        // if (result.msg === "Token has expired") {
        //   Alert.alert("", result.msg);
        //   setUploadingFile(false);
        // }
        else {
          Alert.alert("", result.msg);
          setUploadingFile(false);
        }
        setUploadingFile(false);
      })
      .catch((error) => {
        Alert.alert("", error?.message);
        setUploadingFile(false);
      });
  };

  const toggleTooltip = () => {
    setShowToolTip(!showToolTip);
  };

  // close account preview dialog
  // const handelToggleAccountPreview = useCallback(() => {
  //   setShowPreviewAccount(false);
  //   setCurrentItem(null);
  // }, [setShowPreviewAccount]);
  const handelToggleAccountPreview = () => {
    setShowPreviewAccount(false);
    setCurrentItem(null);
  };

  const handleOnPressMarker = (item) => {
    setCurrentItem(item);
    setShowPreviewAccount(true);
  };

  const handleToggleContactModal = () => {
    setShowContactModal(!showContactModal);
    // setShowPreviewAccount(false);
    // setShowTakeActionModal(false);
  };
  const handleToggleTakeActionModal = () => {
    setShowTakeActionModal(!showTakeActionModal);
    // setShowContactModal(false);
    // setShowPreviewAccount(false);
  };

  const handleFilter = () => {
    setShowFilter(!showFilter);
  };

  const handleFilterFirest30Days = () => {
    // filter users
    const filteredClientData =
      excelData &&
      excelData.map((user) => {
        return user.data.filter((item) =>
          item.ACCOUNT_NAME.toLowerCase().includes(searchTerm?.toLowerCase())
        );
      });
  };
  const center = {
    lat: -3.745,
    lng: -38.523,
  };

  const handleFilter30To60Days = () => {
    // filter users
    const filteredClientData =
      excelData &&
      excelData.map((user) => {
        return user.data.filter((item) =>
          item.ACCOUNT_NAME.toLowerCase().includes(searchTerm?.toLowerCase())
        );
      });
  };

  const handleFilterAbove60Days = () => {
    // filter users
    const filteredClientData =
      excelData &&
      excelData.map((user) => {
        return user.data.filter((item) =>
          item.ACCOUNT_NAME.toLowerCase().includes(searchTerm?.toLowerCase())
        );
      });
  };

  useEffect(() => {
    if (progress === 1) {
      setSHowDownload(false);
    }
  }, [progress]);

  useEffect(() => {
    if (!loadingExcelData && initialExcelData) {
      setExcelData(initialExcelData);
    }
  }, [loadingExcelData, initialExcelData]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      <MapView
        style={{ width: "100%", height: "100%" }}
        provider={GOOGLE_PROVIDER}
        showsUserLocation={true}
        showsMyLocationButton={true}
        zoomControlEnabled
        zoomEnabled
        minZoomLevel={0}
      >
        {excelData &&
          excelData?.length > 0 &&
          excelData.map((user, index) => (
            <View key={index}>
              {user.data &&
                user.data.map((item, i) => {
                  if (item?.coordinates?.lat && item?.coordinates?.lng) {
                    return (
                      <Marker
                        key={i}
                        coordinate={{
                          latitude: item?.coordinates?.lat,
                          longitude: item?.coordinates?.lng,
                        }}
                        // coordinate={{

                        onPress={() => handleOnPressMarker(item)}
                        className="h-12 w-12"
                      >
                        <View
                          style={{
                            backgroundColor: item?.statusColor?.hexColor,
                          }}
                          className="relative w-12 h-12  rounded-full  flex items-center justify-center"
                        >
                          <MarkerIcon />
                        </View>

                        <Callout
                          ref={calloutRef}
                          tooltip={true}
                          style={{ width: 120, height: 45 }}
                        >
                          <View
                            style={{
                              backgroundColor: item?.statusColor.hexColor,
                            }}
                            className="relative w-full h-9 rounded-xl  flex flex-col items-center justify-center "
                          >
                            <CustomTextRegular className="text-white text-center text-[8px] ">
                              {item?.ACCOUNT_NAME}
                            </CustomTextRegular>
                            <CustomTextRegular className="text-white text-center text-[8px]">
                              {item?.statusColor?.text}
                            </CustomTextRegular>
                            <View
                              className={`${Platform.OS === "ios" ? "-mb-5" : "-mb-4"}`}
                            >
                              <CaretDown color={item?.statusColor.hexColor} />
                            </View>
                          </View>
                        </Callout>
                      </Marker>
                    );
                  }
                })}
            </View>
          ))}
      </MapView>

      {/* menu icon and filter */}
      <View
        className=" absolute top-4 flex flex-row items-center px-5 "
        // style={{ marginTop: Platform.OS === "ios" ? 0 : 10 }}
      >
        {/* menu */}
        <TouchableOpacity
          className="h-12 w-12 rounded-full bg-white flex flex-row justify-center items-center  mr-4 "
          onPress={() => navigation.openDrawer()}
        >
          <MenuIcon />
        </TouchableOpacity>

        {/* search and filter */}
        <View className="w-full flex-1 h-12 flex flex-row items-center justify-between bg-white rounded-full  ">
          <TouchableOpacity
            onPress={() => setShowSearch(true)}
            className="W-full flex-1"
          >
            <CustomTextRegular className="p-3 text-sm text-border-color">
              Search account name
            </CustomTextRegular>
          </TouchableOpacity>
          {/* filter */}
          {/* <TouchableOpacity className=" p-3 " onPress={handleFilter}>
            <FilterIcon />
          </TouchableOpacity> */}
        </View>
      </View>
      {/******************** filter modal *************************/}
      {showFilter && (
        <Pressable
          className="absolute top-0 left-0 w-full h-full"
          onPress={handleFilter}
        >
          <View className="w-[60%] absolute top-24 right-5 bg-white rounded-xl px-1 py-4">
            <View className="px-4">
              <CustomTextRegular className="text-black text-xs font-black">
                Filter by:
              </CustomTextRegular>
              <CustomTextRegular className="text-[10px] mt-2 mb-4">
                Last Interaction
              </CustomTextRegular>
              <View className="flex flex-row items-center flex-wrap gap-2  ">
                {["1 - 30 days", "30 - 60 days", "60-above"].map(
                  (item, index) => (
                    <TouchableOpacity
                      key={index}
                      className="bg-tertiary-accent-color rounded-full px-2 py-1"
                    >
                      <CustomTextRegular className="text-[10px] ">
                        {item}
                      </CustomTextRegular>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
            <View className="mt-4 border-t border-t-tertiary-accent-color">
              <View className="px-4 mt-4">
                <CustomTextRegular className="text-[10px]  mb-4">
                  Revenue Generated
                </CustomTextRegular>
                <View className="flex flex-row items-center flex-wrap gap-2 ">
                  {["Ascending", "Descending"].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      className="bg-tertiary-accent-color rounded-full px-2 py-1"
                    >
                      <CustomTextRegular className="text-[10px]">
                        {item}
                      </CustomTextRegular>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}

      {/* add icon */}
      {isAdmin && (
        <TouchableOpacity
          className="absolute right-10 bottom-10 w-[60px] h-[60px] rounded-full bg-primary-color flex items-center justify-center"
          onPress={handleToggleImportExcelFile}
        >
          <AddIcon color={"#fff"} />
        </TouchableOpacity>
      )}

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
              className="px-5 w-full h-[55%] flex flex-col rounded-t-3xl bg-screen-bg"
            >
              <View className="py-10 ">
                <CustomTextRegular className="font-black leading-6 text-base text-black mb-6">
                  Please make sure each excel file has the following header
                  title.
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
                className={`bg-[#C4D1F6] rounded-full mt-4 h-12 py-3 flex justify-center items-center mb-10  `}
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
              {/* download template button */}
              <TouchableOpacity
                onPress={downloadFile}
                className="flex flex-row items-center justify-center mb-6"
              >
                <ExcelIcon />
                <CustomTextRegular className="text-[#999999] font-bold text-lg underline ml-4">
                  Download Template
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
              className="px-5 w-full h-[65%] flex flex-col  rounded-t-3xl bg-screen-bg"
            >
              <View className="py-10 flex flex-col items-center justify-center ">
                <ExcelFIleIcon />
                <CustomTextRegular className="font-black leading-6 text-xl text-black my-6">
                  Import Data
                </CustomTextRegular>
                <View className="flex flex-col items-center">
                  <CustomTextRegular className="text-sm text-center">
                    {
                      "Easily import your account data from Excel for\n streamlined account management."
                    }
                  </CustomTextRegular>
                  <TouchableOpacity onPress={downloadFile}>
                    <CustomTextRegular className="text-red-600 font-bold text-lg underline mt-2">
                      Download Template
                    </CustomTextRegular>
                  </TouchableOpacity>
                </View>
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
        <MapPreviewAccountModal
          showPreviewAccount={showPreviewAccount}
          handelToggleAccountPreview={handelToggleAccountPreview}
          handleToggleTakeActionModal={handleToggleTakeActionModal}
          currentItem={currentItem}
          loadingUploadExcelFile={loadingUploadExcelFile}
          handleToggleContactModal={handleToggleContactModal}
          uniqueId={currentItem?.uniqueId}
          showTakeActionModal={showTakeActionModal}
          showContactModal={showContactModal}
        />
      )}

      {/******************** search modal *************************/}
      {showSearch && (
        <SearchMap
          closeSearchModal={() => setShowSearch(false)}
          handleOnPressMarker={handleOnPressMarker}
          excelData={excelData}
          searchTermInput={searchTerm}
          showSearch={showSearch}
          showPreviewAccount={showPreviewAccount}
          handelToggleAccountPreview={handelToggleAccountPreview}
          handleToggleTakeActionModal={handleToggleTakeActionModal}
          currentItem={currentItem}
          loadingUploadExcelFile={loadingUploadExcelFile}
          handleToggleContactModal={handleToggleContactModal}
          uniqueId={currentItem?.uniqueId}
          showTakeActionModal={showTakeActionModal}
          showContactModal={showContactModal}
        />
      )}

      {/******************** filter modal *************************/}
      {/* {showSearch && (
        <SearchMap
          closeSearchModal={() => setShowSearch(false)}
          handleOnPressMarker={handleOnPressMarker}
          excelData={excelData}
          searchTermInput={searchTerm}
        />
      )} */}

      {(uploadingFile || loadingExcelData) && (
        <LottieLoadingScreen loading={uploadingFile || loadingExcelData} />
      )}
    </SafeAreaView>
  );
};

export default MapScreen;

// git remote add origin https://github.com/Accointsgoal-Project/mobileApp.git
