import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
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

const PendingTodoCard = ({ item, refetch }) => {
  // console.log("pending item ===> ", item);
  const [toggleModal, setToggleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
  const [toggleEditModal, setToggleEditModal] = useState(false);
  const [togglePriority, setTogglePriority] = useState(false);
  const [toggleReminder, setToggleReminder] = useState(
    item.setReminder?.active
  );
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState("date");
  const [dateTimePickerField, setDateTimePickerField] = useState("");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [eventName, setEventName] = useState(item.eventName);
  // const [date, setDate] = useState(new Date())
  const [date, setDate] = useState(new Date(item.date));
  const [priority, setPriority] = useState(item.setPirority);
  const [startTime, setStartTime] = useState(new Date(item.startTime));
  const [endTime, setEndTime] = useState(new Date(item.endTime));
  const [note, setNote] = useState(item.note);
  const [completedTodos, setCompletedTodos] = useState([]);

  const [deleteTodo, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteTodoMutation();
  const [editTodo, { isLoading: loadingEdit, error: editError }] =
    useEditTodoMutation();
  const [
    completeTodo,
    { isLoading: loadingCompleteTodo, error: completeError },
  ] = useCompleteTodoMutation();

  console.log("priority ==> ", priority);

  const handleSelectTodo = (id) => {
    setSelectedItem((prevId) => {
      if (!prevId.includes(id)) {
        return [...prevId, id];
      } else {
        return prevId.filter((item) => item !== id);
      }
    });
  };
  const renderLeftActions = (progress, dragX) => {
    // const trans = dragX.interpolate({
    //   inputRange: [0, 50, 100, 101],
    //   outputRange: [-20, 0, 0, 1],
    // });
    return (
      <View className="flex flex-row items-center pl-4">
        <DeleteComponent onPressDelete={handleDeleteItem} />
      </View>
    );
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
            const response = await completeTodo({ id: id });
            console.log("complete todo response  ==> ", response);
            refetch();
          },
        },
      ]
    );
  };

  const handleDeleteItem = async () => {
    // const response = await deleteTodo({ id: item._id });
    // console.log("delete response ==> ", response);

    Alert.alert("Delete Todo", "Are you sure you want to delete todo?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          const response = await deleteTodo({ id: item._id });
          if (response.data) {
            console.log("delete todo response  ==> ", response);
            refetch();
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

  const handleEditTodo = async () => {
    const body = {
      id: item._id,
      // user: accountsGoalUser._id,
      eventName: eventName,
      date: date.toString(),
      setPirority: priority,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      setReminder: { active: toggleReminder, note: note },
      note: note,
    };
    try {
      const response = await editTodo(body);
      console.log("todo body ==>", body);
      console.log("todo response ===> ", response);

      if (response.data) {
        refetch();
        setShowAlertModal(true);
        handleToggleEditTodoModal();
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

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
      }, 3000);
    }
  });

  return (
    <Swipeable
      className="flex flex-row items-center justify-between"
      renderRightActions={renderLeftActions}
    >
      <Pressable
        onPress={handleToggleModal}
        className={`w-full relative bg-white border-[#B9B9B9] border rounded-lg p-3 mb-4 `}
      >
        {item?.setPirority && (
          <CustomTextRegular
            className={` ${
              windowWidth < -230 ? "w-1/3" : "w-1/3"
            } text-screen-bg text-[10px] font-semibold text-center rounded-2xl px-2  py-1  ${
              item?.setPirority === "High priority"
                ? "bg-high-priority"
                : item?.setPirority === "Medium priority"
                  ? "bg-medium-priority"
                  : item?.setPirority === "Low priority"
                    ? "bg-low-priority"
                    : ""
            }`}
          >
            {item?.setPirority}
          </CustomTextRegular>
        )}

        <CustomTextRegular
          className={`font-semibold text-base my-1 ${item.status === true && "line-through"}`}
        >
          {item?.eventName}
        </CustomTextRegular>
        {item?.note && (
          <CustomTextRegular className="text-[8px] text-primary-accent-color">
            {item?.note}
          </CustomTextRegular>
        )}
        {/* select cirlce */}
        {item.status === false && (
          <Pressable
            className="absolute right-5 top-[50%] flex flex-row justify-center items-center w-6 h-6 rounded-full border border-border-color"
            onPress={() => handleCompleteTodo(item._id)}
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

      {/*********************** view todo modal *************************/}

      {toggleModal && (
        <Modal transparent visible={toggleModal} animationType="slide">
          <View className="h-full w-full bg-transparent">
            <Pressable
              className="h-[60%] bg-black/50"
              onPress={handleToggleModal}
            />
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            className="absolute bottom-0 w-full h-[45%] flex flex-col  rounded-t-3xl  bg-screen-bg px-5"
          >
            <View>
              {/* close button */}
              <TouchableOpacity
                className=" w-6 h-6 flex self-end mt-7 items-center justify-center rounded-full  border border-[#A8A8A8] p-2"
                onPress={handleToggleModal}
              >
                <CloseButton color={"#A8A8A8"} />
              </TouchableOpacity>
              <CustomTextRegular
                className={`font-bold text-base ${item.status === true && "line-through"}`}
              >
                {item?.eventName}
              </CustomTextRegular>

              <CustomTextRegular className=" text-sm text-[#777777] mt-8 text-left ">
                {item?.note}
              </CustomTextRegular>
            </View>

            {/* mark as done button and edit button*/}
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
          </ScrollView>
        </Modal>
      )}

      {/******************** edit todo modal *************************/}
      {toggleEditModal && (
        <Modal
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
              {/* todo */}
              <LabelComponent label={"Todo"} required={true} />
              <TextInputComponent
                placeholder="Todo name"
                labelColor={"#B9B9B9"}
                value={eventName}
                onChangeText={(e) => setEventName(e)}
              />
              {/* date */}
              <LabelComponent label={"Date"} required={true} />
              <Pressable
                className={customButtonWithIcon}
                onPress={() => handelToggleDateTimePickerMode("date", "date")}
              >
                <CalendarIcon color={"#B9B9B9"} />
                <CustomTextRegular className="ml-3 text-sm text-form-text-color">
                  {date.toDateString()}
                </CustomTextRegular>
              </Pressable>

              {/* priority */}
              <LabelComponent label={"Set Priority"} required={true} />
              <Pressable
                className={customButtonWithIcon + " justify-between"}
                onPress={handleTogglePriority}
              >
                <CustomTextRegular className=" text-sm text-form-text-color">
                  {priority}
                </CustomTextRegular>
                <IconCaretDropdown />
              </Pressable>
              {/* priority drop down */}
              {togglePriority && (
                <View className="w-full bg-white rounded-lg my-2 p-3 ">
                  {priorityData.map((item, index) => (
                    <Pressable
                      onPress={() => handleSelectPriority(item.title)}
                      className={`${
                        index === priorityData.length - 1
                          ? "border-none"
                          : "border-b-[0.7px] border-b-form-text-color"
                      }`}
                      key={index}
                    >
                      <CustomTextRegular
                        className={` py-3 ${
                          priority === item.title
                            ? "text-black"
                            : "text-form-text-color"
                        }`}
                      >
                        {item.title}
                      </CustomTextRegular>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* start and end time */}
              <View className="flex flex-row items-center justify-between">
                {/* start time */}
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

                {/* end time */}
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
              </View>

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

      {/* loading complete todo */}
      {loadingCompleteTodo && (
        <LottieLoadingScreen loading={loadingCompleteTodo} />
      )}

      {/*********************** looading todo modal *************************/}
      {(loadingDelete || loadingEdit) && (
        <Modal
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
    </Swipeable>
  );
};

export default PendingTodoCard;
