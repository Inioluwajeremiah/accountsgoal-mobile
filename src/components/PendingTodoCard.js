import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import CustomTextRegular from "./CustomTextRegular";
import { windowWidth } from "../utils/Dimensions";
import TickIcon from "../Icons/TickIcon";
import EditComponent from "./EditComponent";
import DeleteComponent from "./DeleteComponent";
import {
  useCompleteTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
} from "../slices/todoApiSlice";
import LottieView from "lottie-react-native";
import TextInputComponent from "./TextInputComponent";
import LabelComponent from "./LabelComponent";
import ClockIcon from "../Icons/ClockIcon";
import { customButtonWithIcon } from "../utils/stylesVariable";
import CalendarIcon from "../Icons/CalendarIcon";
import { priorityData } from "../utils/dummyData";
import IconCaretDropdown from "../Icons/IconCaretDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownAlert from "./DropDownAlert";
import LottieLoadingScreen from "./LottieLoadingScreen";
import Swipeable from "react-native-gesture-handler/Swipeable";
import CloseButton from "../Icons/CloseButton";
import EditTodoIcon from "../Icons/EditTodoIcon";
import { useSelector } from "react-redux";
import { useGetExcelDataQuery } from "../slices/accountApiSlice";
import CustomTextInputField from "./CustomTextInputField";
import CloseButtonBigIcon from "../Icons/CloseButtonBigIcon";

const PendingTodoCard = ({ item, refetch }) => {
  const { accountsGoalUser, onboarding } = useSelector(
    (state) => state.acgUser
  );

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

  const [toggleModal, setToggleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [toggleEditModal, setToggleEditModal] = useState(false);
  const [togglePriority, setTogglePriority] = useState(false);
  const [toggleReminder, setToggleReminder] = useState(item?.setReminder);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState("date");
  const [dateTimePickerField, setDateTimePickerField] = useState("");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [eventName, setEventName] = useState(item.todoName);
  // const [date, setDate] = useState(new Date())
  const [date, setDate] = useState(new Date(item?.endDate));
  const [priority, setPriority] = useState(item?.setPriority);
  const [startTime, setStartTime] = useState(new Date(item?.startTime));
  const [endTime, setEndTime] = useState(new Date(item?.endTime));
  const [note, setNote] = useState(item?.note);
  const [completedTodos, setCompletedTodos] = useState([]);
  const [toggleAttachClients, settoggleAttachClients] = useState(false);
  const [attachClientInput, setAttaChClientInput] = useState("");
  const [attachedClient, setAttachedClient] = useState(item?.attachClient);
  const [attachedClientUniqueId, setAttachedClientUniqueId] = useState(
    item?.excelRow.uniqueId
  );
  const [toggleNoEndDate, setToggleNoEndDate] = useState(false);
  const goalSwipeRef = useRef(null);

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
      user?.ACCOUNT_NAME?.toLowerCase().includes(
        attachClientInput.toLowerCase()
      )
    );

  const [deleteTodo, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteTodoMutation();
  const [editTodo, { isLoading: loadingEdit, error: editError }] =
    useEditTodoMutation();
  const [
    completeTodo,
    { isLoading: loadingCompleteTodo, error: completeError },
  ] = useCompleteTodoMutation();

  const handleSelectTodo = (id) => {
    setSelectedItem((prevId) => {
      if (!prevId.includes(id)) {
        return [...prevId, id];
      } else {
        return prevId.filter((item) => item !== id);
      }
    });
  };

  const handleCompleteTodo = async (id) => {
    setCompletedTodos((prevId) => {
      if (!prevId.includes(id)) {
        return [...prevId, id];
      } else {
        return prevId.filter((item) => item !== id);
      }
    });
    Alert.alert(
      "Mark as Completed",
      "Are you sure you want to mark as completed?",
      [
        {
          text: "Cancel",
          onPress: () => {
            setCompletedTodos((prevId) => {
              if (!prevId.includes(id)) {
                return [...prevId, id];
              } else {
                return prevId.filter((item) => item !== id);
              }
            });
          },
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            const response = await completeTodo({
              uniqueId: item.excelRow.uniqueId,
              id: id,
            });
            refetch();
          },
        },
      ]
    );
  };
  const handleSelectClients = (todoItem) => {
    setAttachedClient(todoItem.ACCOUNT_NAME);
    setAttachedClientUniqueId(todoItem.uniqueId);
    // setAttaChClientInput("");
    handleToggleAttachClient();
  };

  const handleDeleteItemII = async () => {
    Alert.alert("Delete Todo", "Are you sure you want to delete todo?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const response = await deleteTodo({
            uniqueId: item.excelRow.uniqueId,
            id: item._id,
          });
          if (response.data) {
            // refetch();
          }
        },
      },
    ]);
  };

  const closeSwipeable = () => {
    if (goalSwipeRef.current) {
      goalSwipeRef.current.close();
    }
  };
  const handleDeleteItem = async () => {
    Alert.alert("", `Delete ${item?.todoName}`, [
      {
        text: "Cancel",
        onPress: () => closeSwipeable(),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const response = await deleteTodo({
            uniqueId: item.excelRow.uniqueId,
            id: item._id,
          });
          if (response.data) {
            // refetch();
            if (goalSwipeRef?.current) {
              setTimeout(closeSwipeable, 1500);
            }
          }
        },
      },
    ]);
  };

  const handleToggleModal = () => {
    setToggleModal(!toggleModal);
  };
  const handleToggleEditTodoModal = () => {
    setToggleEditModal(!toggleEditModal);
    // setToggleModal(false);
  };
  const handleTogglePriority = () => {
    setTogglePriority(!togglePriority);
  };
  const handleSelectPriority = (value) => {
    setPriority(value);
    handleTogglePriority();
  };
  const handleToggleReminder = () => {
    setToggleReminder((previousState) => !previousState);
  };
  const handleDateTimePicker = (event, selectedDate) => {
    if (dateTimePickerMode === "date") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    } else if (dateTimePickerMode === "time") {
      const currentDate = selectedDate || date;
      if (dateTimePickerField === "startTime") {
        setStartTime(currentDate);
      } else if (dateTimePickerField === "endTime") {
        setEndTime(currentDate);
      }
    }
    setShowDateTimePicker(false);
  };

  const handelToggleDateTimePickerMode = (field, mode) => {
    setShowDateTimePicker(true);
    setDateTimePickerMode(mode);
    setDateTimePickerField(field);
  };
  const handleToggleAttachClient = () => {
    settoggleAttachClients(!toggleAttachClients);
  };
  const handleToggleNoEndDate = () => {
    setToggleNoEndDate((previousState) => !previousState);
  };

  const handleEditTodo = async () => {
    // const body = {
    //   uniqueId: attachedClientUniqueId,
    //   user: accountsGoalUser._id,
    //   todoName: eventName,
    //   attachClient: attachedClient,
    //   endDate: date.toString(),
    //   setPriority: priority,
    //   noEndDate: toggleNoEndDate,
    //   setReminder: toggleReminder,
    //   status: false,
    //   note: note,
    // };
    const body = {
      id: item._id,
      uniqueId: attachedClientUniqueId,
      user: accountsGoalUser._id,
      todoName: eventName,
      attachClient: attachedClient,
      endDate: date.toString(),
      setPriority: priority,
      noEndDate: toggleNoEndDate,
      setReminder: toggleReminder,
      status: item.status,
      note: note,
    };
    try {
      const response = await editTodo(body);

      if (response.data) {
        refetch();
        setShowAlertModal(true);

        handleSelectTodo(item._id);

        // Alert.alert("", response.data?.message);
      }

      if (response.error) {
        Alert.alert("", response.error.data?.message);
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  const renderLeftActions = () => {
    return (
      <View className="flex flex-row items-center pl-4">
        <DeleteComponent onPressDelete={handleDeleteItem} />
      </View>
    );
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
        handleToggleEditTodoModal();
      }, 2000);
    }
  });

  return (
    <>
      <Swipeable
        className="flex flex-row items-center justify-between"
        renderRightActions={renderLeftActions}
        ref={goalSwipeRef}
      >
        <Pressable
          onPress={handleToggleModal}
          className={`w-full h-32 overflow-y-scroll relative bg-white border-[#B9B9B9] border rounded-lg p-3 mb-4 `}
        >
          {item?.setPriority && (
            <View
              className={` ${
                windowWidth < -230 ? "w-1/3" : "w-1/3"
              }    rounded-2xl px-2  py-1  ${
                item?.setPriority === "High priority"
                  ? "bg-high-priority"
                  : item?.setPriority === "Medium priority"
                    ? "bg-medium-priority"
                    : item?.setPriority === "Low priority"
                      ? "bg-low-priority"
                      : ""
              }`}
            >
              <CustomTextRegular className=" font-semibold text-center text-[10px] text-screen-bg">
                {item?.setPriority}
              </CustomTextRegular>
            </View>
          )}

          <CustomTextRegular
            className={`font-semibold text-base my-1 ${item.status === true && "line-through"}`}
          >
            {item?.todoName}
          </CustomTextRegular>
          {item?.note && (
            <CustomTextRegular className="w-[94%] text-[8px] text-primary-accent-color ">
              {item?.note.length > 100
                ? item?.note.slice(0, 100) + "..."
                : item?.note}
            </CustomTextRegular>
          )}
          {/* select cirlce */}
          {item.status === false && (
            <Pressable
              className="absolute right-5 top-[50%] flex flex-row justify-center items-center w-6 h-6 rounded-full border border-border-color"
              // onPress={() => handleCompleteTodo(item._id)}
            >
              {completedTodos.includes(item._id) ? <TickIcon /> : ""}
              {/* <TickIcon /> */}
            </Pressable>
          )}

          {item.status === true && (
            <Pressable className="absolute right-5 top-[50%] flex flex-row justify-center items-center w-6 h-6 rounded-full border border-border-color">
              <TickIcon />
            </Pressable>
          )}
        </Pressable>
      </Swipeable>

      {/*********************** view todo modal *************************/}

      {toggleModal && (
        <Modal
          key={"view_todo_modal"}
          transparent
          visible={toggleModal}
          animationType="slide"
        >
          <View className="h-full w-full bg-transparent">
            <Pressable
              className="h-[45%] bg-black/50"
              onPress={handleToggleModal}
            />
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            className="absolute bottom-0 w-full h-[60%] flex flex-col  rounded-t-3xl  bg-screen-bg px-5"
          >
            <View>
              {/* close button */}
              <TouchableOpacity
                className=" w-8 h-8 flex self-end mt-7 items-center justify-center rounded-full  border border-[#A8A8A8] p-2"
                onPress={handleToggleModal}
              >
                <CloseButtonBigIcon color={"#A8A8A8"} />
              </TouchableOpacity>
              <CustomTextRegular
                className={`font-bold text-base ${item.status === true && "line-through"}`}
              >
                {item?.todoName}
              </CustomTextRegular>

              <CustomTextRegular className=" text-sm text-[#777777] mt-8 text-left ">
                {item?.note}
              </CustomTextRegular>
            </View>

            {/* mark as done button and edit button*/}
            {item?.status === false && (
              <View className="flex flex-row items-center">
                {/* mark as done */}
                <TouchableOpacity
                  className={`bg-primary-color w-2/3
              rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
                  onPress={() => handleCompleteTodo(item._id)}
                >
                  <CustomTextRegular className="text-center font-semibold text-white text-base">
                    Mark as done
                  </CustomTextRegular>
                </TouchableOpacity>
                {/* edit button */}
                {/* edit goal button */}
                <TouchableOpacity
                  className="absolute bottom-10 right-0 w-12 h-12 rounded-full bg-primary-color flex items-center justify-center"
                  onPress={handleToggleEditTodoModal}
                >
                  <EditTodoIcon color={"#fff"} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {/******************** edit todo modal *************************/}
          {toggleEditModal && (
            <Modal
              key={"edit_todo_modal"}
              transparent={true}
              visible={toggleEditModal}
              animationType="slide"
            >
              <View className="h-full w-full bg-transparent">
                <Pressable
                  className="h-[17%] bg-black/50 "
                  onPress={handleToggleEditTodoModal}
                />
              </View>
              <KeyboardAvoidingView
                // behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="absolute bottom-0 w-full h-[93%] rounded-t-3xl  bg-screen-bg"
              >
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  className="px-5"
                >
                  {/* close button */}
                  <TouchableOpacity
                    className="absolute right-0 top-5 w-8 h-8 flex items-center justify-center rounded-full  border border-[#A8A8A8] "
                    onPress={handleToggleEditTodoModal}
                  >
                    <CloseButtonBigIcon color={"#A8A8A8"} />
                  </TouchableOpacity>
                  {/* todo */}
                  <LabelComponent label={"Todo"} required={true} />
                  <TextInputComponent
                    placeholder="Todo name"
                    labelColor={"#B9B9B9"}
                    value={eventName}
                    onChangeText={(e) => setEventName(e)}
                  />
                  {/* attachedClients */}
                  <LabelComponent
                    label={"Attach client to goals"}
                    required={true}
                  />
                  <Pressable
                    className={customButtonWithIcon + " justify-between"}
                    onPress={handleToggleAttachClient}
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
                          attachClientInput &&
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
                                  attachedClient === item?.ACCOUNT_NAME ||
                                  attachedClientUniqueId === item.uniqueId
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
                  <LabelComponent label={"Date"} required={true} />
                  <Pressable
                    className={customButtonWithIcon}
                    onPress={() =>
                      handelToggleDateTimePickerMode("date", "date")
                    }
                  >
                    <CalendarIcon color={"#B9B9B9"} />
                    <CustomTextRegular className="ml-3 text-sm text-form-text-color">
                      {date.toDateString()}
                    </CustomTextRegular>
                  </Pressable>

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
                      {startTime
                        .toLocaleTimeString()
                        .replace(/:\d{2}\s/, " ") || "12:00 am"}
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
                        false: "rgba(103, 135, 231, 1)",
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
                    value={note}
                    // labelColor={"#C5C5C5"}
                    heightC={75}
                    onChangeText={(e) => setNote(e)}
                  />

                  {/* edit to-do button */}
                  <TouchableOpacity
                    className={`
                  bg-primary-color
                 rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
                    disabled={false}
                    onPress={handleEditTodo}
                  >
                    <CustomTextRegular className="text-center font-semibold text-white text-base">
                      {loadingEdit ? (
                        <ActivityIndicator size="small" color={"#fff"} />
                      ) : (
                        "Save To-do"
                      )}
                    </CustomTextRegular>
                  </TouchableOpacity>
                </ScrollView>
              </KeyboardAvoidingView>

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
                  message={"Todo updated"}
                  type={"success"}
                />
              )}
            </Modal>
          )}

          {/* loading complete todo */}
          {loadingCompleteTodo && (
            <LottieLoadingScreen loading={loadingCompleteTodo} />
          )}

          {/*********************** looading todo modal *************************/}
          {(loadingDelete || loadingEdit) && (
            <Modal
              key={"loading_todo_modal"}
              animationType="none"
              visible={loadingDelete || loadingEdit}
              transparent={true}
            >
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
        </Modal>
      )}

      {/* date time picker */}
      {showDateTimePicker && (
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
          is24Hour={false}
          onChange={handleDateTimePicker}
        />
      )}

      {/*********************** looading todo modal *************************/}
      {(loadingDelete || loadingEdit) && (
        <Modal
          key={"loading_todo_modal"}
          animationType="none"
          visible={loadingDelete || loadingEdit}
          transparent={true}
        >
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
    </>
  );
};

export default PendingTodoCard;
