import {
  View,
  Alert,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import LabelComponent from "../../../components/LabelComponent";
import TextInputComponent from "../../../components/TextInputComponent";
import CalendarIcon from "../../../Icons/CalendarIcon";
import CustomTextRegular from "../../../components/CustomTextRegular";
import { priorityData } from "../../../utils/dummyData";
import ClockIcon from "../../../Icons/ClockIcon";
import { customButtonWithIcon } from "../../../utils/stylesVariable";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownAlert from "../../../components/DropDownAlert";
import IconCaretDropdown from "../../../Icons/IconCaretDropdown";
import { useGetAllUsersQuery } from "../../../slices/usersApiSlice";
import { useCreateTodoMutation } from "../../../slices/todoApiSlice";
import { useSelector } from "react-redux";
import { useGetExcelDataQuery } from "../../../slices/accountApiSlice";
import CustomTextInputField from "../../../components/CustomTextInputField";
import LottieLoadingScreen from "../../../components/LottieLoadingScreen";
import CloseButtonBigIcon from "../../../Icons/CloseButtonBigIcon";

const CreateTodoModal = ({ toggleModal, handleToggleAddTodoModal, item }) => {
  const { accountsGoalUser, onboarding } = useSelector(
    (state) => state.acgUser
  );
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState("date");
  const [dateTimePickerField, setDateTimePickerField] = useState("");
  const [togglePriority, setTogglePriority] = useState(false);
  const [toggleReminder, setToggleReminder] = useState(false);
  const [toggleNoEndDate, setToggleNoEndDate] = useState(false);
  const [toggleAttachClients, settoggleAttachClients] = useState(false);
  const [attachClientInput, setAttaChClientInput] = useState("");
  const [attachedClient, setAttachedClient] = useState(
    item?.ACCOUNT_NAME || ""
  );
  const [attachedClientUniqueId, setAttachedClientUniqueId] = useState(
    item?.uniqueId || ""
  );

  const [eventName, setEventName] = useState("");
  const isValidForm =
    !eventName ||
    !date ||
    !priority ||
    !startTime ||
    !endTime ||
    !attachedClient;

  const [createTodo, { isLoading: loadingCreateTodo, error: createTodoError }] =
    useCreateTodoMutation();

  // get all users => replace with getexcel
  const {
    data: allUsers,
    isLoading: loadingUsers,
    error: userError,
  } = useGetAllUsersQuery();

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

  // filter users
  let newExcelData = [];
  excelData &&
    excelData.forEach((user) => {
      user.data.forEach((data) => newExcelData.push(data));
    });

  // filter users
  const filteredClientData =
    newExcelData &&
    newExcelData.filter((user) =>
      user.ACCOUNT_NAME.toLowerCase().includes(
        attachClientInput.toLocaleLowerCase()
      )
    );

  const handleTogglePriority = () => {
    setTogglePriority(!togglePriority);
  };
  const handleSelectPriority = (value) => {
    setPriority(value);
    handleTogglePriority();
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
  const handleToggleReminder = () => {
    setToggleReminder((previousState) => !previousState);
  };
  const handleToggleNoEndDate = () => {
    setToggleNoEndDate((previousState) => !previousState);
  };
  const handleDateTimePicker = (event, selectedDate) => {
    if (dateTimePickerMode === "date") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    } else if (dateTimePickerMode === "time") {
      const currentDate = selectedDate || date;

      if (dateTimePickerField === "startTime") {
        setStartTime(currentDate);
      }
      if (dateTimePickerField === "endTime") {
        setEndTime(currentDate);
      }
    }
    setShowDateTimePicker(false);
  };

  const handelToggleDateTimePickerMode = (field, mode) => {
    // Alert.alert("", "date time clicked");
    setShowDateTimePicker(true);
    setDateTimePickerMode(mode);
    setDateTimePickerField(field);
  };

  const handleCreateTodo = async () => {
    const body = {
      uniqueId: attachedClientUniqueId,
      user: accountsGoalUser._id,
      todoName: eventName,
      attachClient: attachedClient,
      endDate: toggleNoEndDate ? null : date.toString(),
      setPriority: priority,
      noEndDate: toggleNoEndDate,
      setReminder: toggleReminder,
      status: false,
      note: note,
    };
    try {
      const response = await createTodo(body);

      if (response.data) {
        refetchExcelData();
        setShowAlertModal(true);
        setEventName("");
        setDate(new Date());
        setPriority("");
        setStartTime(new Date());
        setEndTime(new Date());
        setToggleReminder(false);
        setNote("");
      }

      if (response.error) {
        Alert.alert("", response.error.data?.message);
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
        handleToggleAddTodoModal();
      }, 1000);
    }
  });

  return (
    <Modal transparent={true} visible={toggleModal} animationType="slide">
      <View className="h-full w-full bg-transparent">
        <Pressable
          className="h-[20%] bg-black/50 "
          onPress={handleToggleAddTodoModal}
        />
      </View>
      <KeyboardAvoidingView
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="absolute bottom-0 w-full h-[85%] rounded-t-3xl  bg-screen-bg"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-5">
          <TouchableOpacity
            className=" w-8 h-8 flex self-end items-center justify-center p-2 mt-5 mr-5"
            onPress={handleToggleAddTodoModal}
          >
            <View className="w-8 h-8 rounded-full flex items-center justify-center border border-[#A8A8A8]">
              <CloseButtonBigIcon color={"#A8A8A8"} />
            </View>
          </TouchableOpacity>
          {/* todo */}
          <LabelComponent label={"Todo"} required={true} />
          <TextInputComponent
            placeholder="Todo name"
            labelColor={"#B9B9B9"}
            onChangeText={(e) => setEventName(e)}
          />
          {/* attachedClients */}
          <LabelComponent label={"Attach Client to To-Do"} required={true} />
          <Pressable
            className={customButtonWithIcon + " justify-between"}
            // onPress={handleToggleAttachClient}
            onPress={item ? null : handleToggleAttachClient}
          >
            <CustomTextRegular className=" text-sm text-form-text-color">
              {attachedClient}
            </CustomTextRegular>
            <IconCaretDropdown />
          </Pressable>
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
                  filteredClientData.map((user, index) => (
                    <View key={index}>
                      {user?.data?.map((item, i) => (
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
          {/* enddate */}

          {!toggleNoEndDate && (
            <>
              <LabelComponent label={"End Date"} required={true} />
              <Pressable
                className={customButtonWithIcon}
                onPress={() => handelToggleDateTimePickerMode("date", "date")}
              >
                <CalendarIcon color={"#B9B9B9"} />
                <CustomTextRegular className="ml-3 text-sm text-form-text-color">
                  {date?.toDateString()}
                </CustomTextRegular>
              </Pressable>
            </>
          )}

          {/* no end date */}
          <View className="mt-10 items-center flex-row justify-between  ">
            <CustomTextRegular>No end date for task</CustomTextRegular>
            <Switch
              trackColor={{
                false: "#C5C5C5",
                true: "#4169E1",
              }}
              thumbColor={toggleReminder ? "#fff" : "#fff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleNoEndDate}
              value={toggleNoEndDate}
            />
          </View>

          {/* priority */}
          <LabelComponent label={"Set Priority"} required={true} />
          <View className="w-full flex flex-row  mt-4  gap-x-[3%] ">
            {priorityData.slice(1, 4).map((item, index) => (
              <Pressable
                onPress={() => handleSelectPriority(item.title)}
                className={`w-[30%] flex items-center justify-center rounded-lg ${
                  index === 0
                    ? "bg-[#6787E7]"
                    : index === 1
                      ? "bg-[#809BEB]"
                      : "bg-[#C4D1F6]"
                }  ${priority === item.title ? "border border-black" : ""}`}
                key={index}
              >
                <CustomTextRegular
                  className={` text-white text-xs text-center py-1 px-2 ${
                    priority === item.title ? "" : ""
                  }`}
                >
                  {item.title}
                </CustomTextRegular>
              </Pressable>
            ))}
          </View>

          {/* start and end time */}
          {/* <View className="flex flex-row items-center justify-between">
              start time
              <View className="w-[48%]">
                <LabelComponent label={"Start Time"} required={true} />
                <Pressable
                  className={customButtonWithIcon}
                  onPress={() =>
                    handelToggleDateTimePickerMode("startTime", "time")
                  }
                >
                  <ClockIcon color={"#B9B9B9"} />
                  <CustomTextRegular className="ml-3 text-xs text-form-text-color">
                    {startTime.toLocaleTimeString().replace(/:\d{2}\s/, " ") ||
                      "12:00 am"}
                  </CustomTextRegular>
                </Pressable>
              </View>

              end time
              <View className="w-[48%]">
                <LabelComponent label={"End Time"} required={true} />
                <Pressable
                  className={customButtonWithIcon}
                  onPress={() =>
                    handelToggleDateTimePickerMode("endTime", "time")
                  }
                >
                  <ClockIcon color={"#B9B9B9"} />
                  <CustomTextRegular className="ml-3 text-xs text-form-text-color">
                    {endTime.toLocaleTimeString().replace(/:\d{2}\s/, " ") ||
                      "12:00 am"}
                  </CustomTextRegular>
                </Pressable>
              </View>
            </View> */}

          {/* reminder */}
          <View className="mt-10 items-center flex-row justify-between  ">
            <CustomTextRegular>Set Reminder</CustomTextRegular>
            <Switch
              trackColor={{
                false: "#C5C5C5",
                true: "#4169E1",
              }}
              thumbColor={toggleReminder ? "#fff" : "#fff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggleReminder}
              value={toggleReminder}
            />
          </View>

          {/* note */}
          <LabelComponent label={"Note"} required={false} />
          <TextInputComponent
            multiline={true}
            maxLength={250}
            labelColor={"#B9B9B9"}
            // labelColor={"#C5C5C5"}
            heightC={75}
            onChangeText={(e) => setNote(e)}
          />

          {/* create to-do button */}
          <TouchableOpacity
            className={`${
              !isValidForm ? "bg-primary-color" : "bg-[#6787e7]"
            } rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
            disabled={isValidForm ? true : false}
            onPress={handleCreateTodo}
          >
            <CustomTextRegular className="text-center font-semibold text-white text-base">
              {loadingCreateTodo ? (
                <ActivityIndicator size="small" color={"#fff"} />
              ) : (
                "Create To-do"
              )}
            </CustomTextRegular>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={"To do list created"}
          type={"success"}
        />
      )}

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
              value={
                dateTimePickerField === "startTime"
                  ? startTime
                  : dateTimePickerField === "endTime"
                    ? endTime
                    : date
              }
              mode={dateTimePickerMode}
              display={Platform.OS === "ios" ? "inline" : "default"}
              iosDisplay=""
              is24Hour={false}
              onChange={handleDateTimePicker}
              style={{ backgroundColor: "#fff", width: "100%", height: "70%" }}
              minimumDate={new Date()}
            />
          </Pressable>
        </Modal>
      )}

      {/* loading complete todo */}
      {loadingCreateTodo && <LottieLoadingScreen loading={loadingCreateTodo} />}
    </Modal>
  );
};

export default CreateTodoModal;
