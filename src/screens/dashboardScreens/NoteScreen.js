import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
  Platform,
  Alert,
} from "react-native";
import {
  cloudinary_cloud_name,
  cloudinary_api_key,
  cloudinary_secret_key,
  cloudinary_upload_preset,
} from "@env";
import React, { useRef, useState, useEffect } from "react";
import CustomTextRegular from "../../components/CustomTextRegular";
import BackIcon from "../../Icons/BackIcon";
import * as ImagePicker from "expo-image-picker";
import { Cloudinary } from "@cloudinary/url-gen";
import {
  useAddTextMutation,
  useAttachImageMutation,
  useDeleteAudioMutation,
  useDeleteImageMutation,
  useDeleteTextMutation,
  useGetAllNotesByUniqueIdQuery,
  useSendAudioMutation,
  useUpdateNoteMutation,
} from "../../slices/noteApiSlice";
import { useSelector } from "react-redux";
import { Audio } from "expo-av";
import MicrophoneIcon from "../../Icons/MicrophoneIcon";
import AddImageLargeIcon from "../../Icons/AddImageLargeIcon";
import { status_bar_height, windowWidth } from "../../utils/Dimensions";
import * as FileSystem from "expo-file-system";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import ImageView from "react-native-image-viewing";
import MicrophoneActive from "../../Icons/MicrophoneActive";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import { usePermissions } from "expo-av/build/Audio";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import SaveIcon from "../../Icons/SaveIcon";
import KeyboardIcon from "../../Icons/KeyboardIcon";
import DropDownAlert from "../../components/DropDownAlert";

const NoteScreen = ({ navigation, route }) => {
  const { uniqueId } = route.params;
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  const {
    data: notesData,
    refetch: refetchNoteData,
    isLoading: loadingNotesData,
    isError: isNoterror,
    error: getNoteError,
  } = useGetAllNotesByUniqueIdQuery({
    userId: accountsGoalUser?._id,
    uniqueId,
  });

  const [updateNote, { isLoading: loadingUpdateNote }] =
    useUpdateNoteMutation();

  const [image, setImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [sound, setSound] = useState();
  const [recording, setRecording] = useState();
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [permissionResponse, requestPermission] = usePermissions();
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageCurrentUrl, setImageCurrentUrl] = useState("");
  const [toggleImageView, setToggleImageView] = useState(false);
  const [userAudioUrl, setUserAudioUrl] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [userNote, setUserNote] = useState("");

  let time = 0;
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [second, setSecond] = useState("");
  const imageHeight = Math.floor(windowWidth * 0.8);
  const webViewRef = useRef(null);
  const timerRef = useRef(null);
  const richTextRef = useRef();

  const [deleteAudio, { isLoading: loadingDeleteAudio }] =
    useDeleteAudioMutation();
  const [deleteImage, { isLoading: loadingDeleteImage }] =
    useDeleteImageMutation();
  const [deleteText, { isLoading: loadingDeleteText }] =
    useDeleteTextMutation();

  const noteExists = notesData && notesData?.data?.noteId?.text;
  const noteId = notesData && notesData?.data?.noteId?._id;

  let progressValue = progress > 0 ? progress / duration : 0;

  const data = [
    { startTime: 0, endTime: 1000 },
    { startTime: 1000, endTime: 2000 },
    { startTime: 2000, endTime: 3000 },
  ];

  const [
    addText,
    {
      isLoading: loadingAddText,
      isSuccess: isAddTextSuccess,
      isError: isAddTextError,
      error: addTextError,
    },
  ] = useAddTextMutation();

  const [
    attachImage,
    {
      isLoading: loadingAttachImage,
      isError: isAttachImageError,
      error: AttachImageError,
    },
  ] = useAttachImageMutation();
  const [
    sendAudio,
    {
      isLoading: loadingSendAudio,
      isError: isSendAudioError,
      error: SendAudioError,
    },
  ] = useSendAudioMutation();

  const scrollViewRef = useRef(null);

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

  const scrollToEnd = () => {
    const jsCode = `window.scrollTo(0, document.body.scrollHeight)`;
    richTextRef.current?.injectJavascript(jsCode);
  };

  // const scrollToBottom = () => {
  //   if (scrollViewRef) {
  //     scrollViewRef.current.scrollToEnd({ animated: true });
  //   }
  // };

  const options = {
    upload_preset: cloudinary_upload_preset,
    unsigned: true,
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      // base64: true,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0], result.assets[0].type);
    }
  };

  const deleteElement = (buttonElement) => {
    const parentElement = buttonElement.parentNode;
    parentElement.parentNode.removeChild(parentElement);
  };

  const uploadImage = async (imageFile, imageType) => {
    setUploadingImage(true);
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

    fetch(
      `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setProfileImage(result.secure_url);

        // upload url to database
        // const imageHTML = `
        //   <div style="position: relative;">
        //     <img src="${result.secure_url}" style="max-width: 100%; margin-top: 10px; margin-bottom: 10px;" />
        //     <button style="position: absolute; width:32px; height:32px; border-radius:'50%'; top:20px; right: 5px; padding: 5px; background-color: rgba(255, 0, 0, 0.7); color: #fff; border: none; cursor: pointer;" onclick=${() => deleteElement(this)}">X</button>
        //   </div>
        // `;
        const imageHTML = `<img src="${result.secure_url}" style="max-width: 80%; margin-top: 20px; margin-bottom: 20px; object-fit: contain" />`;
        richTextRef.current?.insertHTML(imageHTML);
        handleUploadImage(result.secure_url);
        setUploadingImage(false);
        setTimeout(() => {
          richTextRef.current?.blurContentEditor();
          richTextRef.current?.focusContentEditor();
        }, 100);
        scrollToEnd();
        // scrollToBottom();
      })
      .catch((error) => {
        console.error(error);
        setUploadingImage(false);
      });
  };

  const uploadAudio = async (uri, filename) => {
    setUploadingAudio(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "multipart/form-data");
    const time = new Date().getTime();

    const formfile = {
      uri: uri,
      type: "audio/mp4",
      name: filename,
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

    fetch(
      `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/video/upload`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const audioHTML = `<audio controls style="max-width: 80%; margin-top: 20px; margin-bottom: 20px;"><source src="${result.secure_url}" type="audio/mp3"></audio>`;
        richTextRef.current?.insertHTML(audioHTML);
        setUserAudioUrl(result.secure_url);
        setUploadingAudio(false);
        setTimeout(() => {
          richTextRef.current?.blurContentEditor();
          richTextRef.current?.focusContentEditor();
        }, 100);
        scrollToEnd();
        // scrollToBottom();
      })
      .catch((error) => {
        console.error(error);
        setUploadingAudio(false);
      });
  };

  const playSound = async (item, index) => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setProgress(0);
      setDuration(0);
      progressValue = 0;
      setCurrentIndex(index);
    }
    setCurrentIndex(index);
    const { sound } = await Audio.Sound.createAsync({ uri: item });
    setSound(sound);

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setProgress(status.positionMillis);
        setDuration(status.durationMillis);
        setIsPlaying(true);
      }
    });
    await sound.playAsync();
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
      setProgress(0); // Optionally reset progress to start
    }
  };
  useEffect(() => {
    // Cleanup function to unload sound on component unmount
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const getProgressPercentage = () => {
    if (duration === 0) {
      return 0;
    }
    return (progress / duration) * 100;
  };

  const startTimer2 = () => {
    // const countDownDate = new Date().getTime();

    timerRef.current = setInterval(() => {
      time += 1;
      const seconds = time % 60;
      const minutes = Math.floor(time / 60);
      const hours = Math.floor(time / 3600);
      const days = Math.floor(time / (60 * 60 * 24));
      setHour(hours);
      setMinute(minutes);
      setSecond(seconds);
    }, 1000);
  };

  const startRecording = async () => {
    try {
      if (permissionResponse.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      startTimer2();
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    clearInterval(timerRef.current);
    time = 0;
    setHour("");
    setMinute("");
    setSecond("");

    try {
      // Get the file name from the URI
      const filename = uri.substring(uri.lastIndexOf("/") + 1);
      uploadAudio(uri, filename);

      // if (userAudioUrl) {
      //   const audioHTML = `<audio controls><source src="${userAudioUrl}" type="audio/mp3"></audio>`;
      //   richTextRef.current?.insertHTML(audioHTML);
      //   return;
      // }

      // saveFile(uri, filename, "audio/mp4");
      // Specify the directory where you want to save the file
      const directory = FileSystem.documentDirectory + "recordings/";
      // Create the directory if it doesn't exist
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      // Move the recorded audio file to the specified directory
      const newUri = directory + filename;
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });
    } catch (error) {
      console.error("Error saving recording:", error);
    }
  };

  const cancelRedording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    clearInterval(timerRef.current);
    time = 0;
    setHour("");
    setMinute("");
    setSecond("");
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

  const handleUploadText = async () => {
    if (notesData && notesData?.data?.noteId?._id) {
      const response = await updateNote({
        uniqueId: uniqueId,
        noteId: noteId,
        text: userNote,
      });

      if (response.data) {
        refetchNoteData();
        setAlertMessage(response?.data?.message);
        setAlertType("success");
        setShowAlertModal(true);
      }
      if (response.error) {
        setAlertMessage(response?.error?.data?.message);
        setAlertType("danger");
        setShowAlertModal(true);
      }
    } else {
      const response = await addText({
        user: accountsGoalUser._id,
        text: userNote,
        uniqueId,
      });

      if (response.data) {
        setAlertMessage("Note saved");
        setAlertType("success");
        setShowAlertModal(true);
      }
      if (response.error) {
        setAlertMessage(response?.error?.data?.msg);
        setAlertType("danger");
        setShowAlertModal(true);
      }
    }
  };

  const handleUploadImage = async (url) => {
    const response = await attachImage({
      user: accountsGoalUser._id,
      imageUrl: url,
      uniqueId,
    });
    setUploadingImage(false);
  };

  const handleUploadAudio = async (url) => {
    const response = await sendAudio({
      user: accountsGoalUser._id,
      audioUrl: url,
      uniqueId,
    });
  };

  const renderRightActionsII = () => {
    return <View className="flex w-full flex-row items-center pl-4 "></View>;
  };

  const handleHead = ({ tintColor }) => (
    <Text style={{ color: tintColor }}>H1</Text>
  );

  const customAudioIcon = () => <MicrophoneIcon />;
  const customAddImageIcon = () => <AddImageLargeIcon color={"#A8A8A8"} />;
  const customSaveNoteIcon = () => <SaveIcon color={"#A8A8A8"} />;
  const customKeyboardIcon = () => <KeyboardIcon color={"#A8A8A8"} />;

  const handleSelectImage = (imageUrl) => {
    setImageCurrentUrl(imageUrl);
    setToggleImageView(true);
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
      }, 1000);
    }
  });

  useEffect(() => {
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, [currentAudioUrl]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    let interval = null;

    interval = setInterval(async () => {
      if (recording) {
      }
    }, 1000);
    clearInterval(interval);

    return () => clearInterval(interval);
  }, [recording]);

  useEffect(() => {
    // if (!loadingNotesData && notesData) {
    //   setInitialContent(notesData?.data?.noteId?.text);
    // }
    if (richTextRef.current) {
      richTextRef.current.setContentHTML(notesData?.data?.noteId?.text || "");
    }
  }, [loadingNotesData, notesData]);

  return (
    <>
      <GestureHandlerRootView
        className="flex-1  bg-screen-bg"
        style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
      >
        {/* <CustomTextRegular>{progressValue}</CustomTextRegular> */}
        {/* header */}
        <View className="mt-8 flex flex-row items-center px-5">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="py-2 pr-2"
          >
            <BackIcon />
          </TouchableOpacity>
          {/* title */}
          <CustomTextRegular className="text-base font-bold ml-3">
            Notes
          </CustomTextRegular>
          <TouchableOpacity
            onPress={handleUploadText}
            className="absolute right-5 top-0"
          >
            <SaveIcon color={"#A8A8A8"} />
          </TouchableOpacity>
        </View>

        {/* <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          ref={scrollViewRef}
          // onContentSizeChange={() => scrollToBottom()}
          nestedScrollEnabled={true}
        > */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <RichEditor
            ref={richTextRef}
            // initialContentHTML={initialContent}
            // initialContentHTML=
            onChange={(descriptionText) => {
              setUserNote(descriptionText);
            }}
            value={userNote}
            disabled={false}
            scrollEnabled={true}
            style={{
              flex: 1,
              marginTop: 10,
              // width: "100%",
              // paddingHorizontal: 10,
            }}
            // useContainer={false}
            useContainer={true}
            editorStyle={{
              flex: 1,
              backgroundColor: "#fff",
              contentCSSText: `
              padding-bottom: 30px;
              position: absolute;
              top: 0; right: 0; bottom: 0; left: 0;`,
            }}
          />

          {/* </ScrollView> */}

          {/* rich toolbar */}
          <RichToolbar
            editor={richTextRef}
            className="fixed bottom-0 h-14 w-full py-2 px-5 bg-screen-bg "
            actions={[
              "imageAction",
              "audioAction",
              actions.keyboard,
              // "saveNote",
            ]}
            // onPressAddImage={pickImage}
            audioAction={startRecording}
            // saveNote={handleUploadText}
            imageAction={pickImage}
            iconMap={{
              imageAction: customAddImageIcon,
              [actions.heading1]: handleHead,
              audioAction: customAudioIcon,
              // [actions.insertImage]: customAddImageIcon,
              // saveNote: customSaveNoteIcon,
              [actions.keyboard]: customKeyboardIcon,
            }}
          />
        </KeyboardAvoidingView>

        {/* recording view */}
        {recording && (
          <View className="absolute bottom-0 w-full h-14 py-2 px-5 bg-white flex flex-row items-center justify-between ">
            <CustomTextRegular
              style={{ width: windowWidth * 0.25 }}
              className="py-2"
            >
              {hour.toString().padStart(2, "0")}:
              {minute.toString().padStart(2, "0")}:
              {second.toString().padStart(2, "0")}
            </CustomTextRegular>
            <Swipeable
              className=" flex flex-row items-center justify-between"
              renderRightActions={renderRightActionsII}
              onSwipeableRightOpen={cancelRedording}
            >
              <View
                style={{ width: windowWidth * 0.65 }}
                className="flex flex-row items-center justify-between "
              >
                <CustomTextRegular className="py-2 text-[#777777]">
                  {"< swipe left to delete"}
                </CustomTextRegular>
                {/* stop recording to send to database */}
                <TouchableOpacity onPress={stopRecording}>
                  <MicrophoneActive />
                </TouchableOpacity>
              </View>
            </Swipeable>
          </View>
        )}
        {/* </KeyboardAvoidingView> */}
      </GestureHandlerRootView>
      {toggleImageView && (
        <ImageView
          images={[{ uri: imageCurrentUrl }]}
          imageIndex={0}
          visible={toggleImageView}
          animationType="slide"
          presentationStyle="fullScreen"
          swipeToCloseEnabled={true}
          doubleTapToZoomEnabled={true}
          onRequestClose={() => setToggleImageView(false)}
        />
      )}

      {(loadingSendAudio ||
        loadingAttachImage ||
        loadingAddText ||
        uploadingImage ||
        loadingNotesData ||
        loadingDeleteAudio ||
        loadingDeleteImage ||
        loadingDeleteText ||
        loadingUpdateNote ||
        uploadingAudio) && (
        <LottieLoadingScreen
          loading={
            loadingSendAudio ||
            loadingAttachImage ||
            loadingAddText ||
            uploadingImage ||
            uploadingImage ||
            loadingNotesData ||
            loadingDeleteAudio ||
            loadingDeleteImage ||
            loadingDeleteText ||
            loadingUpdateNote
          }
        />
      )}
      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={alertMessage}
          type={alertType}
        />
      )}
    </>
  );
};

export default NoteScreen;
