import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomTextRegular from "./CustomTextRegular";
import CustomTextInputField from "./CustomTextInputField";
import {
  useSendEmailDataMutation,
  useSendGreetingEmailMutation,
  useUpdateEmailDataMutation,
} from "../slices/emailApiSlice";
import CloseButton from "../Icons/CloseButton";
import EditTodoIcon from "../Icons/EditTodoIcon";
import DropDownAlert from "./DropDownAlert";
import { windowWidth } from "../utils/Dimensions";
import CloseButtonBigIcon from "../Icons/CloseButtonBigIcon";

const NotificationCard = ({
  item,
  index,
  lastIndex,
  isGreetingEmail,
  uniqueId,
  sendTo,
}) => {
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleEditModal, setToggleEditModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [emailContent, setEmailContent] = useState(item?.content);

  const [
    sendEmailData,
    {
      isLoading: loadingSendEmail,
      isErrror: isErrorEmail,
      isSuccess: isSuccessEmail,
      error: sendEmailError,
    },
  ] = useSendEmailDataMutation();

  const [
    sendGreetingEmail,
    {
      isLoading: loadingSendGreetingEmail,
      isErrror: isErrorGreetingEmail,
      isSuccess: isSuccessGreetingEmail,
      error: sendGreetingEmailError,
    },
  ] = useSendGreetingEmailMutation();

  const [
    updateEmailData,
    { isLoading: loadingUpdate, isError, isSuccess, error },
  ] = useUpdateEmailDataMutation();

  const handleToggleModal = () => {
    setToggleModal(!toggleModal);
  };
  const handleToggleEditTodoModal = () => {
    setToggleEditModal(!toggleEditModal);
  };
  const renderLeftActions = (progress, dragX) => {
    return (
      <View className="flex flex-row items-center pl-4">
        {/* <DeleteComponent onPressDelete={handleDeleteItem} /> */}
      </View>
    );
  };

  const handleSendEmail = async () => {
    const response = await sendEmailData({ emailDraftId: item?._id });

    if (response.data?.message === "Email sent successfully.") {
      setShowAlertModal(true);
      setAlertType("success");
      setAlertMessage("Email sent successfully");
      setToggleModal(false);
    } else {
      setShowAlertModal(true);
      setAlertType("danger");
      setAlertMessage("Error sending email");
    }
  };

  const handleSendGreetingEmail = async () => {
    const response = await sendGreetingEmail({
      emailDraftId: item?._id,
      uniqueId: uniqueId,
    });

    if (response.data?.message === "Email sent successfully.") {
      setShowAlertModal(true);
      setAlertType("success");
      setAlertMessage("Email sent successfully");
      setToggleModal(false);
    }
    if (response?.error) {
      setShowAlertModal(true);
      setAlertType("danger");
      setAlertMessage("Error sending email");
    }
  };
  const handleUpdateEmail = async () => {
    const response = await updateEmailData({
      emailId: item?._id,
      content: emailContent,
    });
    if (response.data?._id) {
      setShowAlertModal(true);
      setAlertType("success");
      setAlertMessage("Email updated and sent successfully");
      setToggleEditModal(false);
      // setToggleModal(false);
    } else {
      setShowAlertModal(true);
      setAlertType("danger");
      setAlertMessage("Error updating email");
    }
  };

  const handleSendUpdatedGreetingEmail = async () => {
    const response = await sendGreetingEmail({
      emailDraftId: item?._id,
      uniqueId: uniqueId,
    });
    if (response.data?.message === "Email sent successfully.") {
      setShowAlertModal(true);
      setAlertType("success");
      setAlertMessage("Email sent successfully");
      setToggleEditModal(false);
    }
    if (response?.error) {
      setShowAlertModal(true);
      setAlertType("danger");
      setAlertMessage("Error sending email");
    }
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
        setToggleEditModal(false);
      }, 2000);
    }
  });
  return (
    <View>
      <Pressable
        onPress={handleToggleModal}
        style={{ width: windowWidth * 0.9 }}
        className={` relative bg-white border-[#B9B9B9] border rounded-lg p-3 ${lastIndex === index ? "mb-20" : "mb-4"} `}
      >
        <CustomTextRegular
          className={`font-bold text-secondary-accent-color text-sm my-1 ${item.status === true && "line-through"}`}
        >
          {item?.subject}
        </CustomTextRegular>

        {sendTo && (
          <CustomTextRegular className="text-sm text-primary-accent-color ">
            Send to: {item?.to}
          </CustomTextRegular>
        )}

        <CustomTextRegular className="text-sm text-primary-accent-color">
          {item?.content && item?.content.length > 150
            ? item.content?.slice(0, 150) + "..."
            : item?.content}
        </CustomTextRegular>
      </Pressable>

      {/*********************** view todo modal *************************/}

      {toggleModal && (
        <Modal transparent visible={toggleModal} animationType="slide">
          <View className="h-full w-full flex-1">
            <Pressable
              className="h-[65%] bg-black/50"
              onPress={handleToggleModal}
            />

            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "space-between",
              }}
              className=" w-full h-[50%] flex flex-col -mt-20 rounded-t-3xl  bg-screen-bg px-5"
            >
              <View>
                {/* close button */}
                <TouchableOpacity
                  className=" w-8 h-8 flex self-end mt-7 items-center justify-center rounded-full  border border-[#A8A8A8] p-2"
                  onPress={handleToggleModal}
                >
                  <CloseButtonBigIcon color={"#A8A8A8"} />
                </TouchableOpacity>
                {!isGreetingEmail && (
                  <>
                    <CustomTextRegular className={`font-bold text-base`}>
                      {item?.subject}
                    </CustomTextRegular>

                    <CustomTextRegular className=" text-sm text-[#777777] mt-8 text-left ">
                      {item?.to}
                    </CustomTextRegular>
                  </>
                )}
                <CustomTextRegular className=" text-sm text-[#777777] mt-8 text-left ">
                  {item?.content}
                </CustomTextRegular>
              </View>

              {/* send mail button and edit button*/}
              <View className="flex flex-row items-center">
                {/* send mail button */}
                <TouchableOpacity
                  className={`bg-primary-color w-2/3
            rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
                  onPress={
                    isGreetingEmail ? handleSendGreetingEmail : handleSendEmail
                  }
                >
                  {loadingSendEmail || loadingSendGreetingEmail ? (
                    <ActivityIndicator size="small" color={"#fff"} />
                  ) : (
                    <CustomTextRegular className="text-center font-semibold text-white text-base">
                      Send mail
                    </CustomTextRegular>
                  )}
                </TouchableOpacity>

                {/* edit mail button */}

                <TouchableOpacity
                  className="absolute bottom-10 right-0 w-12 h-12 rounded-full bg-primary-color flex items-center justify-center"
                  onPress={handleToggleEditTodoModal}
                >
                  <EditTodoIcon color={"#fff"} />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
          {/******************** edit todo modal *************************/}
          {toggleEditModal && (
            <Modal
              transparent={true}
              visible={toggleEditModal}
              animationType="slide"
            >
              <View className="h-full w-full bg-transparent">
                <Pressable
                  className="h-[65%] bg-black/50 "
                  onPress={handleToggleEditTodoModal}
                />
                <ScrollView
                  className="h-[50%] w-full flex flex-col -mt-20 rounded-t-3xl  bg-screen-bg px-5"
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <View className="w-full">
                    {/* close button */}
                    <TouchableOpacity
                      className=" w-8 h-8 flex self-end mt-7 items-center justify-center rounded-full  border border-[#A8A8A8] p-2"
                      onPress={handleToggleEditTodoModal}
                    >
                      <CloseButtonBigIcon color={"#A8A8A8"} />
                    </TouchableOpacity>

                    {!isGreetingEmail && (
                      <>
                        <CustomTextRegular className="text-secondary-accent-color font-bold text-sm">
                          {item?.subject}
                        </CustomTextRegular>
                        <CustomTextRegular className="text-sm my-2 text-secondary-accent-color">
                          Email to: {item?.to}
                        </CustomTextRegular>
                      </>
                    )}
                    <CustomTextRegular className="text-secondary-accent-color font-bold text-sm">
                      Content
                    </CustomTextRegular>
                    <CustomTextInputField
                      value={emailContent}
                      multiline
                      cursorColor={"#5C5C5C"}
                      onChangeText={(e) => setEmailContent(e)}
                      className="border border-secondary-accent-color h-36 rounded-xl px-4 text-sm text-secondary-accent-color mt-2"
                    />
                  </View>

                  {/* update and send mail button */}
                  <TouchableOpacity
                    className={`
                  bg-primary-color w-full
                 rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
                    disabled={false}
                    onPress={
                      isGreetingEmail
                        ? handleSendUpdatedGreetingEmail
                        : handleUpdateEmail
                    }
                  >
                    <CustomTextRegular className="text-center font-semibold text-white text-base">
                      {loadingUpdate || loadingSendGreetingEmail ? (
                        <ActivityIndicator size="small" color={"#fff"} />
                      ) : (
                        "Send mail"
                      )}
                    </CustomTextRegular>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </Modal>
          )}
          {/* alert */}
          {showAlertModal && (
            <DropDownAlert
              showAlertModal={showAlertModal}
              message={alertMessage}
              type={alertType}
            />
          )}
        </Modal>
      )}

      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={alertMessage}
          type={alertType}
        />
      )}
    </View>
  );
};

export default NotificationCard;
