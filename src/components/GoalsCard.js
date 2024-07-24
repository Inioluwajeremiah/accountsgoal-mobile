import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  useDeleteGoalMutation,
  useEditGoalMutation,
  useGetColorStatusQuery,
} from "../slices/goalApiSlice";
import CustomTextRegular from "./CustomTextRegular";
import CalendarSmall from "../Icons/CalendarSmall";
import UserIcon from "../Icons/UserIcon";
import * as Progress from "react-native-progress";
import { windowWidth } from "../utils/Dimensions";
import CloseButton from "../Icons/CloseButton";
import EditProfileIcon from "../Icons/EditProfileIcon";
import EditTodoIcon from "../Icons/EditTodoIcon";
import LabelComponent from "./LabelComponent";
import TextInputComponent from "./TextInputComponent";
import { customButtonWithIcon } from "../utils/stylesVariable";
import IconCaretDropdown from "../Icons/IconCaretDropdown";
import CalendarIcon from "../Icons/CalendarIcon";
import ProfileIcon from "../Icons/ProfileIcon";
import CustomTextInputField from "./CustomTextInputField";
import TickIcon from "../Icons/TickIcon";
import DropDownAlert from "./DropDownAlert";
import DateTimePicker from "@react-native-community/datetimepicker";
import SubgoalsText from "./SubgoalsText";
import DeleteComponent from "./DeleteComponent";
import LottieView from "lottie-react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useSelector } from "react-redux";
import { useGetExcelDataQuery } from "../slices/accountApiSlice";
import { BASE_URL } from "../utils/Endpoints";
import CloseButtonBigIcon from "../Icons/CloseButtonBigIcon";

const GoalsCard = ({ item, index, lastIndex }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  const [selectedItem, setSelectedItem] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [editGoalModal, setEditGoalModal] = useState(false);
  const [toggleAttachClients, settoggleAttachClients] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [goalName, setGoalName] = useState(item.goalName);
  const [editGoalName, setEditGoalName] = useState(item.goalName);
  const [date, setDate] = useState(
    item?.endDate ? new Date(item?.endDate) : new Date()
  );
  // const [attachedClients, setAttachedClients] = useState([]);
  const [attachClientInput, setAttaChClientInput] = useState("");
  const [attachedClients, setAttachedClients] = useState(item?.client);
  const [attachedClient, setAttachedClient] = useState("");
  const [attachedClientUniqueId, setAttachedClientUniqueId] = useState(
    item?.excelRow?.uniqueId
  );
  const [toggleNewSUbgoals, setToggleNewSubgoals] = useState(false);
  const [subgoalInput, setSubgoalInput] = useState("");
  const [subgoals, setSubgoals] = useState(item?.subGoals);
  const [selectedSubgoals, setSelectedSubgoals] = useState(item?.subGoals);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const goalSwipeRef = useRef(null);

  const subGoalsLength = item?.subGoals?.length;
  const completedSubgoals = item?.subGoals.reduce((accumulator, item) => {
    if (item?.status === true) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);

  const progressValue =
    subGoalsLength > 0 ? completedSubgoals / subGoalsLength : 0;

  // const progressValue = 2;

  const isValidForm = !goalName || !date || !attachedClients;

  const [
    editGoal,
    { isLoading: loadingEditGoal, error: editGoalError, isSuccess },
  ] = useEditGoalMutation();

  const [deleteGoal, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteGoalMutation();

  const {
    data: excelData,
    isLoading: loadingExcelData,
    isError: isExceElrror,
    error: excelDataError,
    refetch: refetchExcelData,
  } = useGetExcelDataQuery({
    userId: accountsGoalUser?._id,
    token: accountsGoalUser?.token,
  });

  // const {
  //   data: colorStatus,
  //   refetch: refetchColorStatus,
  //   isLoading: loadingColorStatus,
  //   error: colorStatusError,
  // } = useGetColorStatusQuery({
  //   userId: accountsGoalUser?._id,
  //   uniqueId: item?.uniqueId,
  // });

  let newExcelData = [];
  excelData &&
    excelData.forEach((user) => {
      user.data.forEach((data) => newExcelData.push(data));
    });

  // filter users
  const filteredClientData =
    newExcelData &&
    newExcelData.filter((user) =>
      user?.ACCOUNT_NAME?.toLowerCase().includes(
        attachClientInput.toLowerCase()
      )
    );

  const handleToggleModal = () => {
    setToggleModal(!toggleModal);
  };
  const handleToggleEditModal = () => {
    setEditGoalModal(!editGoalModal);
  };
  const handleToggleAttachClient = () => {
    settoggleAttachClients(!toggleAttachClients);
  };

  const handleSelectClients = (item) => {
    setAttachedClient(item.ACCOUNT_NAME);
    setAttachedClientUniqueId(item.uniqueId);
    // setAttaChClientInput("");
    handleToggleAttachClient();
  };

  const getColorStatus = () => {
    fetch(
      `${BASE_URL}goal/color-status/${accountsGoalUser?._id}?excelUniqueId=${item?.excelRow.uniqueId}`,
      {
        method: "GET",
        // Authorization: `Bearer ${accountsGoalUser?.token}`,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        refetchExcelData();
      })

      .catch((err) => {});
  };

  const handleDateTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDateTimePicker(false);
  };

  const handelToggleDateTimePickerMode = () => {
    setShowDateTimePicker(true);
  };
  const handleToggleNewSubgoals = () => {
    setToggleNewSubgoals(!toggleNewSUbgoals);
  };
  const handleSelectGoals = (id) => {
    setSelectedItem((prevId) => {
      if (!prevId.includes(id)) {
        return [...prevId, id];
      } else {
        return prevId.filter((item) => item !== id);
      }
    });
  };

  const handleSetSubgoals = () => {
    if (subgoalInput.trim() !== "") {
      if (!toggleNewSUbgoals) {
        setSubgoals((prevGoals) => [
          ...prevGoals,
          { title: subgoalInput, status: false },
        ]);
        setSelectedSubgoals((prevGoals) => [
          ...prevGoals,
          { title: subgoalInput, status: false },
        ]);

        setSubgoalInput("");
        setToggleNewSubgoals(false);
      } else {
        setSubgoals((prevGoals) => [
          ...prevGoals,
          { title: subgoalInput, status: true },
        ]);

        setSelectedSubgoals((prevGoals) => [
          ...prevGoals,
          { title: subgoalInput, status: true },
        ]);

        setSubgoalInput("");
        setToggleNewSubgoals(false);
      }
    }
  };
  const handleSelectSubgoals = (index) => {
    setSelectedSubgoals((prevGoals) => {
      if (prevGoals[index].status === false) {
        // If status is false, set it to true
        return [
          ...prevGoals.slice(0, index), // Keep previous items before the updated one
          { ...prevGoals[index], status: true }, // Update the status of the selected item
          ...prevGoals.slice(index + 1), // Keep previous items after the updated one
        ];
      }
      if (prevGoals[index].status === true) {
        // If status is true, set it to false
        return [
          ...prevGoals.slice(0, index), // Keep previous items before the updated one
          { ...prevGoals[index], status: false }, // Update the status of the selected item
          ...prevGoals.slice(index + 1), // Keep previous items after the updated one
        ];
      }
      // Return the previous state if no condition is met
      return prevGoals;
    });
  };

  const handleRemoveSubgoals = (goal) => {
    setSubgoals((prevGoals) => {
      if (prevGoals.includes(goal)) {
        return prevGoals.filter((item) => item !== goal);
      } else {
        return [...prevGoals, goal];
      }
    });
    setSelectedSubgoals((prevGoals) => {
      if (prevGoals.includes(goal)) {
        return prevGoals.filter((item) => item !== goal);
      } else {
        return [...prevGoals, goal];
      }
    });
  };

  const closeSwipeable = () => {
    if (goalSwipeRef.current) {
      goalSwipeRef.current.close();
    }
  };

  const handleDeleteItem = () => {
    Alert.alert("", `Delete ${item.goalName}`, [
      {
        text: "Cancel",
        onPress: () => closeSwipeable(),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const response = await deleteGoal({
            uniqueId: item.excelRow.uniqueId,
            id: item._id,
          });

          if (response.data) {
            if (goalSwipeRef?.current) {
              setTimeout(closeSwipeable, 1500);
            }
          }
        },
      },
    ]);
  };

  const handleEditGoal = async () => {
    const body = {
      id: item._id,
      uniqueId: attachedClientUniqueId,
      goalName: goalName,
      client: attachedClients,
      endDate: date.toString(),
      subGoals: selectedSubgoals,
    };

    try {
      const response = await editGoal(body);

      if (response.data) {
        // refetch();
        setShowAlertModal(true);
        getColorStatus();
      }

      if (response.error) {
        Alert.alert("", response.error.data.message);
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  const renderLeftActions = () => {
    return (
      <View
        className={`flex flex-row items-center pl-4 ${lastIndex === index ? "mb-20" : "mb-4"}`}
      >
        <DeleteComponent onPressDelete={handleDeleteItem} />
      </View>
    );
  };

  // show alert modal
  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
        handleToggleModal();
      }, 2000);
    }
  });

  return (
    <>
      {/* goal card */}
      <Swipeable
        ref={goalSwipeRef}
        className="flex flex-row items-center justify-between"
        renderRightActions={renderLeftActions}
      >
        <Pressable
          key={index}
          className={`w-full relative bg-white  py-3 px-4 ${lastIndex === index ? "mb-20" : "mb-4"} border border-[#A8A8A8] rounded-3xl`}
          onPress={handleToggleModal}
          style={{}}
        >
          <CustomTextRegular className=" text-base font-bold text-left">
            {item?.goalName || "Goal name"}
          </CustomTextRegular>

          <View className="flex flex-row items-center mt-6">
            <CalendarSmall />
            <CustomTextRegular className="text-xs text-form-text-color  ml-2">
              {new Date(item?.endDate).toDateString() || "30 days left"}
            </CustomTextRegular>
          </View>
          <View className="flex flex-row items-center mt-2">
            <UserIcon />
            <CustomTextRegular className="text-xs text-form-text-color ml-2">
              {attachedClients || "Baylor scott & White Irving"}
            </CustomTextRegular>
          </View>
          {/* <Progress.Bar progress={0.3} width={200} /> */}
          <View className="absolute flex justify-center items-center right-4 bottom-0 top-0 ">
            <Progress.Circle
              size={50}
              progress={progressValue}
              showsText
              formatText={() => Math.floor(progressValue * 100) + "%"}
              thickness={3}
              unfilledColor="#E4E4E4"
              borderWidth={0}
              color={
                progressValue <= 0.3
                  ? "#F35555"
                  : progressValue > 0.3 && progressValue < 0.7
                    ? "#ffa600e6"
                    : "#226e22eb"
              }
              textStyle={{ fontSize: 15, fontWeight: "600" }}
            />
          </View>
        </Pressable>
      </Swipeable>
      {/* loading animation */}
      {loadingDelete && (
        <Modal animationType="none" visible={loadingDelete} transparent={true}>
          <View className="flex-1 h-full w-full bg-black/30 justify-center items-center">
            <LottieView
              className="w-32 h-32"
              source={require("../../assets/starloader.json")}
              autoPlay
              loop={true}
            />
          </View>
        </Modal>
      )}

      {/************** view goal modal *************/}
      {toggleModal && (
        <Modal transparent={true} visible={toggleModal} animationType="slide">
          <View className="h-full w-full bg-transparent">
            <Pressable
              className="h-[40%] bg-black/50"
              onPress={handleToggleModal}
            />
          </View>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="absolute bottom-0 w-full h-[65%] rounded-t-3xl  bg-screen-bg px-5"
          >
            {/* close button */}
            <TouchableOpacity
              className=" w-8 h-8 flex self-end mt-7 items-center justify-center rounded-full  border border-[#A8A8A8] p-2"
              onPress={handleToggleModal}
            >
              <CloseButtonBigIcon color={"#A8A8A8"} />
            </TouchableOpacity>
            <CustomTextRegular className=" text-base font-bold text-left ">
              {item?.goalName || "Goal name"}
            </CustomTextRegular>

            <View className="flex flex-row items-center mt-6">
              <CalendarSmall />
              <CustomTextRegular className="text-xs text-form-text-color  ml-2">
                {item?.endDate || "30 days left"}
              </CustomTextRegular>
            </View>
            <View className="flex flex-row items-center mt-2">
              <UserIcon />
              <CustomTextRegular className="text-xs text-form-text-color ml-2">
                {item?.client || "Baylor scott & White Irving"}
              </CustomTextRegular>
            </View>

            <View className="mt-10 ">
              <Progress.Bar
                progress={progressValue}
                width={windowWidth - 40}
                height={10}
                borderRadius={20}
                unfilledColor="#E4E4E4"
                borderWidth={0}
                color={
                  progressValue <= 0.3
                    ? "#F35555"
                    : progressValue > 0.3 && progressValue < 0.7
                      ? "#ffa600e6"
                      : "#226e22eb"
                }
              />
              <View className="flex flex-row justify-between mt-2 mb-6">
                <CustomTextRegular
                  className={`${
                    progressValue <= 0.3
                      ? "text-[#F35555]"
                      : progressValue > 0.3 && progressValue < 0.7
                        ? "text-[#ffa600e6]"
                        : "text-[#226e22eb]"
                  } text-xs font-semibold`}
                >
                  {completedSubgoals} / {subGoalsLength}
                </CustomTextRegular>
                <CustomTextRegular
                  className={`${
                    progressValue <= 0.3
                      ? "text-[#F35555]"
                      : progressValue > 0.3 && progressValue < 0.7
                        ? "text-[#ffa600e6]"
                        : "text-[#226e22eb]"
                  } text-xs font-semibold`}
                >
                  {Math.floor(progressValue * 100)}%
                </CustomTextRegular>
              </View>
            </View>

            {/* list sub goals */}

            <SubgoalsText />
            <View className="pb-10">
              {selectedSubgoals.map((item, index) => (
                <View
                  className="w-full flex flex-row items-center mt-4  "
                  key={index}
                >
                  {/* check box */}
                  <View className="h-4 w-4 border border-black flex flex-row justify-center items-center">
                    {item.status === true && <TickIcon />}
                  </View>
                  <CustomTextRegular className="ml-4">
                    {item.title}
                  </CustomTextRegular>
                </View>
              ))}
            </View>
            {/* edit goal button */}
            <TouchableOpacity
              className="absolute bottom-10 right-0 w-[60px] h-[60px] rounded-full bg-primary-color flex items-center justify-center"
              onPress={handleToggleEditModal}
            >
              <EditTodoIcon color={"#fff"} />
            </TouchableOpacity>
          </ScrollView>

          {/************** edit goal modal *************/}
          {editGoalModal && (
            <Modal
              transparent={true}
              visible={toggleModal}
              animationType="slide"
            >
              <View className="h-full w-full bg-transparent">
                <Pressable
                  className="h-[25%] bg-black/50"
                  onPress={handleToggleEditModal}
                />
              </View>
              <View className="absolute bottom-0 flex-1 w-full h-[85%] rounded-t-3xl  bg-screen-bg ">
                <KeyboardAvoidingView
                  behavior={Platform.OS === "ios" ? "padding" : "height"}
                  keyboardVerticalOffset={Platform.OS === "ios" ? 32 : 32}
                  className="flex-1 h-full w-full "
                >
                  <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    className=" flex-1 px-5"
                  >
                    {/* close button */}
                    <TouchableOpacity
                      className="absolute right-0 top-5 w-8 h-8 flex items-center justify-center rounded-full  border border-[#A8A8A8] "
                      onPress={handleToggleEditModal}
                    >
                      <CloseButtonBigIcon color={"#A8A8A8"} />
                    </TouchableOpacity>
                    {/* goal name */}
                    <LabelComponent label={"Goal Name"} required={true} />
                    <View className="max-h-12 border border-form-text-color flex flex-row items-center justify-between rounded-3xl mt-4 py-3 px-6 ">
                      <CustomTextInputField
                        placeholder="Goal name"
                        placeholderTextColor={"#B9B9B9"}
                        cursorColor={"#B9B9B9"}
                        onChangeText={(e) => setGoalName(e)}
                        value={goalName}
                        className="w-[70%]"
                      />
                      {goalName && (
                        <TouchableOpacity
                          className="w-6 h-6 flex items-center justify-center rounded-full  border border-[#000] "
                          onPress={() => setGoalName("")}
                        >
                          <CloseButton color={"#000"} />
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* attachedClients */}
                    <LabelComponent
                      label={"Attach client to goals"}
                      required={true}
                    />
                    <Pressable
                      className={customButtonWithIcon + " justify-between"}
                      onPress={handleToggleAttachClient}
                    >
                      <CustomTextRegular className="text-sm text-black">
                        <ProfileIcon /> {"   "} {attachedClients}
                      </CustomTextRegular>
                      <IconCaretDropdown />
                    </Pressable>
                    {/* attachedClients drop down */}
                    {/* attachedClients drop down */}
                    {toggleAttachClients && (
                      <View className="w-full bg-white rounded-lg my-2 p-3 ">
                        {/* filter clients */}
                        <CustomTextInputField
                          placeholder="filter user"
                          placeholderTextColor={"#B9B9B9"}
                          cursorColor={"#B9B9B9"}
                          value={attachClientInput}
                          className="h-12 border-b border-b-border-color px-2 text-primary-accent-color "
                          onChangeText={(e) => setAttaChClientInput(e)}
                        />
                        {/* {filteredClientData &&
                      filteredClientData.map((item, index) => (
                        <View key={index}>
                        
                          <Pressable
                            onPress={() => handleSelectClients(item.email)}
                            className={`${
                              index === filteredClientData.length - 1
                                ? "border-none"
                                : "border-b-[0.7px] border-b-form-text-color"
                            }`}
                            key={index}
                          >
                            <CustomTextRegular
                              className={` py-3 ${
                                attachedClients === item.email
                                  ? "text-black"
                                  : "text-form-text-color"
                              }`}
                            >
                              {item.email}
                            </CustomTextRegular>
                          </Pressable>
                        </View>
                      ))} */}

                        <View>
                          {filteredClientData &&
                            filteredClientData.map((item, i) => (
                              <Pressable
                                key={i}
                                onPress={() => handleSelectClients(item)}
                                //   className={`${
                                //     i === user?.data?.length - 1
                                //       ? "border-none"
                                //       : "border-b-[0.7px] border-b-form-text-color"
                                //   }`}
                              >
                                <CustomTextRegular
                                  className={` py-3 ${
                                    attachedClient === item?.ACCOUNT_NAME
                                      ? "text-black"
                                      : "text-form-text-color"
                                  }`}
                                >
                                  {item?.ACCOUNT_NAME}
                                </CustomTextRegular>
                              </Pressable>
                            ))}
                        </View>
                      </View>
                    )}

                    {/* end date */}
                    <LabelComponent label={"End Date"} required={true} />
                    <Pressable
                      className={customButtonWithIcon}
                      onPress={handelToggleDateTimePickerMode}
                    >
                      <CalendarIcon color={"#000"} />
                      <CustomTextRegular className="ml-3 text-sm text-black">
                        {date.toDateString()}
                      </CustomTextRegular>
                    </Pressable>

                    {/* edit sub goals */}
                    <LabelComponent label={"Sub Goals"} required={true} />

                    <View className="w-full flex flex-row items-center mt-2">
                      {/* check box */}
                      <TouchableOpacity
                        className="h-4 w-4 border border-black flex flex-row justify-center items-center"
                        onPress={handleToggleNewSubgoals}
                      >
                        {toggleNewSUbgoals && <TickIcon />}
                      </TouchableOpacity>
                      <CustomTextInputField
                        placeholder={"list item"}
                        placeholderTextColor={"#B9B9B9"}
                        cursorColor={"#B9B9B9"}
                        value={subgoalInput}
                        className={`flex-1 text-sm ml-4 h-12 ${
                          toggleNewSUbgoals && "border-b border-b-border-color"
                        }`}
                        onChangeText={(e) => setSubgoalInput(e)}
                        onSubmitEditing={handleSetSubgoals}
                      />
                    </View>

                    {/* list sub goals */}
                    {selectedSubgoals.map((item, index) => (
                      <View
                        className="w-full flex flex-row items-center mt-4 "
                        key={index}
                      >
                        {/* check box */}
                        <TouchableOpacity
                          className="h-4 w-4 border border-black flex flex-row justify-center items-center"
                          onPress={() => handleSelectSubgoals(index)}
                        >
                          {item.status === true ? <TickIcon /> : ""}
                          {/* {selectedSubgoals.includes(item) && <TickIcon />} */}
                        </TouchableOpacity>
                        <CustomTextRegular className="ml-4">
                          {item.title}
                        </CustomTextRegular>
                        <TouchableOpacity
                          className="absolute right-0 w-4 h-4 flex items-center justify-center rounded-full  border border-[#000] "
                          onPress={() => handleRemoveSubgoals(item)}
                        >
                          <CloseButton color={"#000"} />
                        </TouchableOpacity>
                      </View>
                    ))}

                    {/* save goals button */}

                    <TouchableOpacity
                      className={`${
                        !isValidForm ? "bg-primary-color" : "bg-[#6787e7]"
                      } rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
                      disabled={isValidForm ? true : false}
                      onPress={handleEditGoal}
                    >
                      <CustomTextRegular className="text-center font-semibold text-white text-base">
                        {loadingEditGoal ? (
                          <ActivityIndicator size="small" color={"#fff"} />
                        ) : (
                          "Save Goal"
                        )}
                      </CustomTextRegular>
                    </TouchableOpacity>
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>

              {/* date time picker */}
              {showDateTimePicker && (
                <Modal
                  transparent={true}
                  visible={showDateTimePicker}
                  animationType="slide"
                >
                  <Pressable
                    className="h-full w-full flex flex-col justify-center items-center bg-black/20 "
                    onPress={() => setShowDateTimePicker(false)}
                  >
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode={"date"}
                      is24Hour={false}
                      onChange={handleDateTimePicker}
                      display={Platform.OS === "ios" ? "inline" : "default"}
                      style={{
                        backgroundColor: "#fff",
                        width: "100%",
                        height: "70%",
                      }}
                      minimumDate={new Date()}
                    />
                  </Pressable>
                </Modal>
              )}

              {/* alert */}
              {showAlertModal && (
                <DropDownAlert
                  showAlertModal={showAlertModal}
                  message={"Goal updated"}
                  type={"success"}
                />
              )}
            </Modal>
          )}
        </Modal>
      )}
    </>
  );
};

export default GoalsCard;
