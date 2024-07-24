import {
  View,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import LabelComponent from "../../../components/LabelComponent";
import CustomTextInputField from "../../../components/CustomTextInputField";
import CustomTextRegular from "../../../components/CustomTextRegular";
import { customButtonWithIcon } from "../../../utils/stylesVariable";
import IconCaretDropdown from "../../../Icons/IconCaretDropdown";
import CloseButton from "../../../Icons/CloseButton";
import {
  useCreateSummaryMutation,
  useRemindMeLaterMutation,
  useUpdateColorMutation,
} from "../../../slices/summaryApiSlice";
import { useSelector } from "react-redux";
import LottieLoadingScreen from "../../../components/LottieLoadingScreen";
import DropDownAlert from "../../../components/DropDownAlert";
import { BASE_URL } from "../../../utils/Endpoints";
import CloseButtonBigIcon from "../../../Icons/CloseButtonBigIcon";

const summaryType = [
  { type: "Video call" },
  { type: "Audio call" },
  { type: "In-person" },
];

const CreateSummaryModal = ({
  toggleModal,
  handleToggleModal,
  handleToggleTakeActionModal,
  uniqueId,
}) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const [summaryTitle, setSummaryTitle] = useState("");
  const [summaryValue, setSummaryValue] = useState("");
  const [toggleSummaryTypeModal, setToggleSummaryTypeModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const isValidForm = !summaryTitle || !summaryValue;

  const [
    createSummary,
    { isLoading: loadingCreateSummary, error: createSummaryError },
  ] = useCreateSummaryMutation();
  const [
    remindMeLater,
    { isLoading: loadingRemindmeLater, error: remindmeLaterError },
  ] = useRemindMeLaterMutation();
  const [
    updateColor,
    { isLoading: loadingUpdateColor, error: updateColorError },
  ] = useUpdateColorMutation();

  const handleToggleSummaryTypeModal = () => {
    setToggleSummaryTypeModal(!toggleSummaryTypeModal);
  };

  const handleCloseButton = () => {
    handleToggleTakeActionModal();
    handleToggleModal();
  };

  const updateColorStatus = () => {
    fetch(`${BASE_URL}update-color-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uniqueId: uniqueId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {})

      .catch((err) => {
        console.log("get color error ==> ", err);
      });
  };

  const handleCreateSummary = async () => {
    const response = await createSummary({
      uniqueId: uniqueId,
      userId: accountsGoalUser?._id,
      meetingType: summaryTitle,
      meetingContent: summaryValue,
    });
    if (response.data?.message === "Summary submitted and fields updated") {
      updateColorStatus();
      setShowAlertModal(true);
      setAlertType("success");
      setAlertMessage("Summary submitted and fields updated");
    } else {
      setShowAlertModal(true);
      setAlertType("danger");
      setAlertMessage("Error submitting fields");
    }
  };

  /**
   * initiate interaction will trigger create-button end point via
   *  useRemindMeLaterMutation hook
   */
  const handleInitiateInteraction = async () => {
    const response = await remindMeLater({
      uniqueId: uniqueId,
      userId: accountsGoalUser?._id,
    });

    if (response.data?.message === "Button clicked") {
      updateColorStatus();
      setShowAlertModal(true);
      setAlertType("success");
      setAlertMessage("Interaction initiated reminder will be sent afterwards");
    } else {
      setShowAlertModal(true);
      setAlertType("danger");
      setAlertMessage("Error initiating interaction");
    }
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
        if (alertType === "success") {
          handleCloseButton();
        }
      }, 2000);
    }
  });

  return (
    <Modal transparent={true} visible={toggleModal} animationType="slide">
      <View className="h-full w-full">
        <Pressable
          className="h-[40%] bg-black/50"
          onPress={handleCloseButton}
        />
      </View>

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="absolute bottom-0 w-full h-[65%] rounded-t-3xl  bg-screen-bg px-5"
      >
        <View className="pt-6 ">
          <TouchableOpacity
            className=" w-8 h-8 flex self-end items-center justify-center  p-2"
            onPress={handleCloseButton}
          >
            <View className="w-8 h-8 rounded-full flex items-center justify-center border border-[#A8A8A8]">
              <CloseButtonBigIcon color={"#A8A8A8"} />
            </View>
          </TouchableOpacity>
          <CustomTextRegular className="font-black leading-6 text-base text-black">
            {"Summary"}
          </CustomTextRegular>
        </View>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* summary type */}
          <LabelComponent label={"Summary type"} required={true} />
          <Pressable
            className={customButtonWithIcon + " justify-between"}
            onPress={handleToggleSummaryTypeModal}
          >
            <CustomTextRegular className=" text-sm text-form-text-color">
              {summaryTitle}
            </CustomTextRegular>
            <IconCaretDropdown />
          </Pressable>
          {toggleSummaryTypeModal && (
            <View className="mt-4">
              {summaryType.map((item, i) => (
                <Pressable
                  key={i}
                  onPress={() => {
                    setSummaryTitle(item.type);
                    handleToggleSummaryTypeModal();
                  }}
                >
                  <CustomTextRegular
                    className={` py-2 ${
                      summaryTitle === item.type
                        ? "text-black"
                        : "text-form-text-color"
                    }`}
                  >
                    {item.type}
                  </CustomTextRegular>
                </Pressable>
              ))}
            </View>
          )}

          {/* summary */}
          <LabelComponent label={"Summary"} required={true} />
          <CustomTextInputField
            value={summaryValue}
            multiline
            cursorColor={"#5C5C5C"}
            onChangeText={(e) => setSummaryValue(e)}
            className="border text-start border-secondary-accent-color h-36 rounded-xl px-4 text-sm text-secondary-accent-color mt-2"
          />
        </KeyboardAvoidingView>

        {/* create summary button */}

        <View className="flex flex-row items-center justify-between mt-8">
          {/* take an action button */}
          <TouchableOpacity
            className={`w-full ${
              !isValidForm ? "bg-primary-color" : "bg-[#6787e7]"
            } rounded-full mt-4 h-12 py-3 flx justify-center items-center mb-10  `}
            disabled={isValidForm ? true : false}
            onPress={handleCreateSummary}
          >
            <CustomTextRegular className="text-center font-semibold text-white text-base">
              {loadingCreateSummary ? (
                <ActivityIndicator size="small" color={"#fff"} />
              ) : (
                "Save summary"
              )}
            </CustomTextRegular>
          </TouchableOpacity>
          {/* cancel button */}
          {/* <TouchableOpacity
            className={`w-[35%] h-12 bg-primary-color rounded-full mt-4 py-3 flx justify-center items-center mb-10  `}
            disabled={false}
            onPress={handleInitiateInteraction}
          >
            <CustomTextRegular className="text-xs text-white-color">
              {loadingRemindmeLater ? (
                <ActivityIndicator size="small" color={"#fff"} />
              ) : (
                "Remind me later"
              )}
            </CustomTextRegular>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      {/* {(loadingCreateSummary || loadingRemindmeLater) && (
        <LottieLoadingScreen
          loading={loadingCreateSummary || loadingRemindmeLater}
        />
      )} */}

      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={alertMessage}
          type={alertType}
        />
      )}
    </Modal>
  );
};

export default CreateSummaryModal;
