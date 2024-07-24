import {
  cloudinary_cloud_name,
  cloudinary_api_key,
  cloudinary_secret_key,
  cloudinary_upload_preset,
} from "@env";
import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";

import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import AddImageIcon from "../../Icons/AddImageIcon";
import userPng from "../../../assets/user.png";
import { useEffect, useState } from "react";
import CustomTextInput from "../../components/CustomTextInput";
import CustomPhoneInput from "../../components/CustomPhonetInput";
import DropDownAlert from "../../components/DropDownAlert";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "../../slices/usersApiSlice";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { setAcgUserData } from "../../slices/userSlice";
import * as ImagePicker from "expo-image-picker";
import { Cloudinary } from "@cloudinary/url-gen";
import { status_bar_height } from "../../utils/Dimensions";

const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinary_cloud_name,
    api_key: cloudinary_api_key,
    api_secret: cloudinary_secret_key,
  },
  url: {
    secure: true,
  },
});

const options = {
  upload_preset: cloudinary_upload_preset,
  unsigned: true,
};

const ProfileInfoScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  //
  const [updateUser, { isLoading: loadingUpdate, error: updateError }] =
    useUpdateUserMutation();
  const [email, setEmail] = useState(accountsGoalUser?.email);
  const [fullName, setFullName] = useState(accountsGoalUser?.fullName);
  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState(
    accountsGoalUser?.profileImage
  );
  const [countryCode, setCountryCode] = useState(
    accountsGoalUser?.mobile.split("").slice(0, 4).join("")
  );
  const [mobile, setMobile] = useState(
    `${accountsGoalUser?.mobile.split("").slice(4, 14).join("")}`
  );
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isFullNameValid, setIsFullNameValid] = useState(true);
  const [isDisabledArray, setisDisabledArray] = useState([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (imageFile) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "multipart/form-data");
    const time = new Date().getTime();
    const imageName = `${accountsGoalUser._id + time}.${imageFile.uri.split(".")[3]}`;
    const formfile = {
      uri: imageFile.uri,
      type: imageFile.mimeType,
      name: imageName,
    };
    const formdata = new FormData();
    formdata.append("file", formfile);
    formdata.append("upload_preset", cloudinary_upload_preset);
    formdata.append("public_id", accountsGoalUser._id + time);
    formdata.append("api_key", cloudinary_api_key);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };
    setUploadingImage(true);
    fetch(
      `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setProfileImage(result.secure_url);
        setUploadingImage(false);
      })
      .catch((error) => {
        console.error(error);
        setUploadingImage(false);
      });
  };

  const handleEmail = (e) => {
    if (!isValidEmail(e)) {
      setIsEmailValid(false);
      if (isDisabledArray.includes("email")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "email")
        );
      }
    } else if (isValidEmail(e)) {
      setEmail(e);
      setIsEmailValid(true);
      if (!isDisabledArray.includes("email")) {
        setisDisabledArray((prevArray) => [...prevArray, "email"]);
      }
    }
  };

  const handleFullName = (e) => {
    if (e.length === 0) {
      setFullName(e);
      setIsFullNameValid(false);
      if (isDisabledArray.includes("fullname")) {
        setisDisabledArray((prevArray) =>
          prevArray.filter((item) => item !== "fullname")
        );
      }
    } else {
      setFullName(e);
      setIsFullNameValid(true);
      if (!isDisabledArray.includes("fullname")) {
        setisDisabledArray((prevArray) => [...prevArray, "fullname"]);
      }
    }
  };
  const handleToggleAlertModal = () => {
    setShowAlertModal(!showAlertModal);
  };

  const handleSaveChanges = async (uploadUrl) => {
    try {
      const body = {
        token: accountsGoalUser.token,
        id: accountsGoalUser._id,
        email,
        fullName,
        mobile: countryCode + mobile,
        profileImage: profileImage,
      };
      const res = await updateUser(body);
      if (res.data) {
        dispatch(
          setAcgUserData({ ...res.data, token: body?.token, login: true })
        );
        // Alert.alert("", res.data.message);
        setShowAlertModal(true);
      }
      if (res.error) {
        console.log(" error ===>", res);

        return;
      }
    } catch (error) {
      Alert.alert("", error?.message || error.data.msg);
    }
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
      }, 3000);
    }
  });

  return (
    <SafeAreaView
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      <ScrollView className="px-5" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1">
          {/* header */}
          <View className="mt-4 flex flex-row items-center ">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="-ml-2 py-2 pr-2"
            >
              <BackIcon />
            </TouchableOpacity>
            <CustomTextRegular className="text-base font-bold ml-3">
              Profile Info
            </CustomTextRegular>
          </View>
          {/* image and title */}
          <View className="mt-10 flex flex-row items-center">
            {/* image */}
            <TouchableOpacity
              className="relative rounded-full"
              onPress={pickImage}
            >
              {accountsGoalUser.profileImage ? (
                <Image
                  source={{
                    uri: accountsGoalUser.profileImage,
                  }}
                  className="h-12 w-12 rounded-full bg-border-color"
                />
              ) : (
                <Image
                  source={userPng || { uri: profileImage }}
                  className="h-12 w-12"
                />
              )}
              <View className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FFA500] flex items-center justify-center">
                <AddImageIcon />
              </View>
            </TouchableOpacity>
            {/* title */}
            <View className="ml-8">
              <CustomTextRegular className="text-sm font-bold  ">
                Update your picture
              </CustomTextRegular>
              <CustomTextRegular className="text-tomato-red text-xs mt-1">
                Upload a picture under 2 MB
              </CustomTextRegular>
            </View>
          </View>

          {/* change password */}
          <TouchableOpacity
            className="flex self-end mt-6 py-2 pr-2"
            onPress={() => navigation.navigate("changeProfilePassword")}
          >
            <CustomTextRegular className=" text-primary-color text-[10px] ">
              Change password
            </CustomTextRegular>
          </TouchableOpacity>

          <CustomTextInput
            labelColor={"#D7D7D7"}
            value={email}
            label={"Email"}
            required={false}
            isValid={isEmailValid}
            onChangeText={handleEmail}
          />
          <CustomTextInput
            value={fullName}
            labelColor={"#D7D7D7"}
            label={"Full Name"}
            required={false}
            isValid={isFullNameValid}
            onChangeText={handleFullName}
          />
          {/* phone number */}
          <CustomPhoneInput
            value={mobile}
            labelColor={"#D7D7D7"}
            label={"Phone Number"}
            placeholder="60132776328"
            selectedCode={countryCode}
            onSelectCode={(code) => setCountryCode(code)}
            onChangeText={(text) => setMobile(text)}
          />
        </View>

        <View className="pb-10">
          {/* send invitation button */}
          <TouchableOpacity
            className={` bg-primary-color
           rounded-full mt-16 h-12 py-3 flx justify-center items-center`}
            onPress={handleSaveChanges}
          >
            <CustomTextRegular className="text-center font-semibold text-white text-base">
              Save Changes
            </CustomTextRegular>
          </TouchableOpacity>
        </View>
        {showAlertModal && (
          <DropDownAlert
            message={"Changes successfully Saved"}
            type={"success"}
            showAlertModal={showAlertModal}
            ToggleAlertModal={handleToggleAlertModal}
          />
        )}
        {uploadingImage && <LottieLoadingScreen loading={uploadingImage} />}
        {loadingUpdate && <LottieLoadingScreen loading={loadingUpdate} />}
        {updateError &&
          Alert.alert(
            "",
            updateError?.error ||
              updateError?.error?.data?.msg ||
              updateError?.data?.msg
          )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileInfoScreen;
