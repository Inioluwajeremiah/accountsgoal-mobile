// JavaScript version of the imports
import isEmpty from "lodash/isEmpty";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Button,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import testIDs from "../utils/testIDs";
import CustomTextRegular from "../components/CustomTextRegular";
import ClockIcon from "./ClockIcon";
import SmallClockIcon from "./SmallClockIcon";
import EditComponent from "../components/EditComponent";
import DeleteComponent from "../components/DeleteComponent";
import { LinearGradient } from "expo-linear-gradient";
import EditTodoIcon from "./EditTodoIcon";
import CalendarIcon from "./CalendarIcon";
import LabelComponent from "../components/LabelComponent";
import TextInputComponent from "../components/TextInputComponent";
import MeetinIcon from "./MeetinIcon";
import { customButtonWithIcon } from "../utils/stylesVariable";
import { getDateRemaining, getTimeRemaining } from "../utils/timeUtils";
import LocationIcon from "./LocationIcon";
import {
  useDeleteEventMutation,
  useEditEventMutation,
} from "../slices/eventApiSlice";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import CustomTextInputField from "../components/CustomTextInputField";
import DropDownAlert from "../components/DropDownAlert";
import LottieLoadingScreen from "../components/LottieLoadingScreen";
import Swipeable from "react-native-gesture-handler/Swipeable";

const AgendaItem = ({ item, refetch }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  // console.log("agenda props ===> ", props);
  // const { item } = props;
  const [selectedItems, setSelectedItems] = useState([]);
  const [toggleEditEventModal, setToggleEditEventModal] = useState(false);
  const [toggleViewEventModal, setToggleViewEventModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState("date");
  const [dateTimePickerField, setDateTimePickerField] = useState("");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [location, setLocation] = useState(item?.location || "");
  const [meetingLink, setMeetingLink] = useState(item?.meetingLink || "");
  const [eventName, setEventName] = useState(item.eventName);
  // const [date, setDate] = useState(new Date())
  const [date, setDate] = useState(new Date(item.date).toDateString());
  const [priority, setPriority] = useState(item.setPirority);
  const [startTime, setStartTime] = useState(new Date(item.startTime));
  const [endTime, setEndTime] = useState(new Date(item.endTime));
  const [note, setNote] = useState(item?.note || "");
  const [selected, setSelectedItem] = useState([]);

  const isValidForm = !eventName || !date || !startTime || !endTime;

  const [editEvent, { isLoading: loadingEdit, error: editError }] =
    useEditEventMutation();
  const [deleteEvent, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteEventMutation();

  // const timeRemaining = getTimeRemaining(item?.date);
  const timeRemaining = 2;

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

  const handleDeleteItem = async () => {
    const response = await deleteEvent({ id: item._id });
    console.log("delete response ==> ", response);
    if (response.data) {
      refetch();
    }
  };

  const handeLongPress = (id) => {
    setSelectedItems((prevItems) => {
      if (prevItems.includes(id)) {
        return prevItems.filter((item) => item !== id);
      } else {
        return [...prevItems, id];
      }
    });
  };

  const handleToggleViewEventModal = () => {
    setToggleViewEventModal(!toggleViewEventModal);
  };
  const handleToggleEditEventModal = () => {
    setToggleEditEventModal(!toggleEditEventModal);
  };

  const handleDateTimePicker = (event, selectedDate) => {
    if (dateTimePickerMode === "date") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    } else if (dateTimePickerMode === "time") {
      new Date(selectedTime).getTime();
      const selectedTime = selectedDate || date;
      console.log(
        "time difference ==> ",
        new Date(selectedTime).getTime() +
          " +++ " +
          new Date(startTime).getTime()
      );
      // if (new Date(selectedTime).getTime() < new Date(startTime).getTime()) {
      if (dateTimePickerField === "startTime") {
        setStartTime(selectedTime);
      } else if (dateTimePickerField === "endTime") {
        setEndTime(selectedTime);
      }
    }
    const currentDate = selectedDate;
    setShowDateTimePicker(false);
    // setDate(currentDate);
    console.log("dateTimePickerField ==> ", dateTimePickerField);
    console.log("startTime ==> ", startTime);
    console.log("endTime ==> ", endTime);
  };

  const handelToggleDateTimePickerMode = (field, mode) => {
    setShowDateTimePicker(true);
    setDateTimePickerMode(mode);
    setDateTimePickerField(field);
  };

  const handleEditEvent = async () => {
    const body = {
      id: item._id,
      user: accountsGoalUser._id,
      eventName,
      location: location,
      meetingLink: meetingLink,
      date: date.toString(),
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      note: note,
      mode: item?.mode,
    };
    try {
      const response = await editEvent(body);
      console.log("Event body ==>", body);
      console.log("Event response ===> ", response);
      if (response.data) {
        refetch();
        setShowAlertModal(true);
        handleToggleEditEventModal();

        // Alert.alert("", response.data?.message);
      }

      if (response.error) {
        Alert.alert("", response.error.data.message);
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  if (isEmpty(item)) {
    return (
      <View className="px-5 ">
        <CustomTextRegular className="text-black text-base">
          No events yet
        </CustomTextRegular>
      </View>
    );
  }

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
      }, 3000);
    }
  });

  return (
    <Swipeable
      className={`flex flex-row items-center justify-between `}
      renderRightActions={renderLeftActions}
    >
      <TouchableOpacity
        onPress={handleToggleViewEventModal}
        testID={testIDs.agenda.ITEM}
        className={`flex-1 bg-white px-4 mb-4 rounded-lg `}
      >
        {/* new ai banner */}
        {timeRemaining && item.mode !== "manual" && (
          <View className="absolute top-0 right-0 bg-high-priority py-1 px-4 rounded-tr-lg">
            <CustomTextRegular className=" font-medium text-[8px]  text-white">
              NEW AI Scheduling
            </CustomTextRegular>
          </View>
        )}
        <View className="flex flex-row justify-between mt-5 mb-1">
          {item.mode === "manual" ? (
            <CustomTextRegular className="text-xs">Manual</CustomTextRegular>
          ) : (
            <LinearGradient
              colors={["#4169E1", "#FFA500"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-md"
            >
              <CustomTextRegular className="text-xs text-white px-1">
                AI Scheduling
              </CustomTextRegular>
            </LinearGradient>
          )}
          <CustomTextRegular className=" absolute right-0 w-[60%] text-[10px] text-high-priority text-end">
            {getDateRemaining(item.date)} remmaining
            {/* {item.duration}  */}
          </CustomTextRegular>
        </View>

        <View className="relative flex-row mb-4 mt-2">
          {item.mode === "manual" && (
            <View className="w-1 rounded-2xl  bg-black" />
          )}
          {item.mode === "ai" && (
            <LinearGradient
              colors={["#FFA500", "#4169E1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              className="rounded-2xl w-1"
            />
          )}
          <View className="ml-4">
            <CustomTextRegular className="font-bold mb-1">
              {item.eventName}
            </CustomTextRegular>
            <CustomTextRegular className="text-xs text-primary-accent-color my-1 ">
              {item?.meetingLink || "Meeting Link"}
            </CustomTextRegular>
            <View className="flex flex-row items-center mt-2 ">
              <SmallClockIcon />
              <CustomTextRegular className="text-[10px] ml-2 ">
                {new Date(item.startTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                -{" "}
                {new Date(item.endTime).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </CustomTextRegular>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {selectedItems.includes(item.id) && (
        <View className="flex flex-row items-center pl-4 ">
          {/* <EditComponent onPressEdit={null} /> */}
          <DeleteComponent onPressDelete={handleDeleteItem} />
        </View>
      )}

      {/* view event modal */}
      {toggleViewEventModal && (
        <Modal
          visible={toggleViewEventModal}
          animationType="slide"
          transparent={true}
        >
          <View className="w-full h-full">
            <Pressable
              onPress={handleToggleViewEventModal}
              className="h-[40%] w-full bg-black/50"
            />
            <View className="-mt-20 h-[70%] bg-white rounded-t-3xl ">
              {/* edit button */}
              <TouchableOpacity
                className="flex flex-row self-end items-center px-5 py-4"
                onPress={handleToggleEditEventModal}
              >
                <EditTodoIcon color={"#474747"} />
                <CustomTextRegular className="text-[#474747] ml-2">
                  Edit
                </CustomTextRegular>
              </TouchableOpacity>
              <View className="px-5">
                <CustomTextRegular className="text-xl font-bold">
                  {item.eventName}
                </CustomTextRegular>
                <View className="flex flex-row items-center mt-6 mb-4">
                  <ClockIcon color={"#777777"} />
                  <CustomTextRegular className="text-primary-accent-color text-sm ml-4">
                    {new Date(item.startTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    -{" "}
                    {new Date(item.endTime).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </CustomTextRegular>
                </View>
                <View className="flex flex-row items-center">
                  <CalendarIcon color={"#777777"} />
                  <CustomTextRegular className="text-sm ml-4 text-primary-accent-color">
                    {new Date(item.date).toDateString()}
                  </CustomTextRegular>
                </View>
              </View>
              <View className="h-[0.5px] w-full bg-primary-accent-color mt-6" />
            </View>
          </View>
        </Modal>
      )}

      {/* edit event modal */}
      {toggleEditEventModal && (
        <Modal
          transparent={true}
          visible={toggleEditEventModal}
          animationType="slide"
        >
          <View className="h-full w-full">
            <Pressable
              className="h-[15%] bg-black/50"
              onPress={handleToggleEditEventModal}
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
              {/* event */}
              <LabelComponent label={"Event name"} required={true} />
              <CustomTextInputField
                placeholder="Event name"
                labelColor={"#B9B9B9"}
                cursorColor={"#B9B9B9"}
                placeholderTextColor={"#B9B9B9"}
                value={eventName}
                onChangeText={(e) => setEventName(e)}
                className="w-full h-12 text-form-text-color px-6 border border-border-color rounded-full mt-4 "
              />
              {/* location */}
              <LabelComponent label={"Location"} required={false} />
              <View className="w-full flex flex-row items-center border border-border-color rounded-full px-6 mt-4 h-12">
                <LocationIcon />
                <CustomTextInputField
                  placeholder="Location"
                  labelColor={"#B9B9B9"}
                  cursorColor={"#B9B9B9"}
                  placeholderTextColor={"#B9B9B9"}
                  value={location}
                  onChangeText={(e) => setLocation(e)}
                  className="flex-1  h-full text-form-text-color px-2 "
                />
              </View>
              {/* meeting link */}
              <LabelComponent label={"Meeting link"} required={false} />
              <View className="w-full flex flex-row items-center border border-border-color rounded-full px-6 mt-4 h-12">
                <MeetinIcon />
                <CustomTextInputField
                  placeholder="Meeting link"
                  labelColor={"#B9B9B9"}
                  placeholderTextColor={"#B9B9B9"}
                  cursorColor={"#B9B9B9"}
                  value={meetingLink}
                  onChangeText={(e) => setMeetingLink(e)}
                  className="flex-1  h-full text-form-text-color px-2 "
                />
              </View>

              {/* date */}
              <LabelComponent label={"Date"} required={true} />
              <Pressable
                className={customButtonWithIcon}
                onPress={() => handelToggleDateTimePickerMode("date", "date")}
              >
                <CalendarIcon color={"#B9B9B9"} />
                <CustomTextRegular className="ml-3 text-sm text-form-text-color">
                  {new Date(date).toDateString()}
                </CustomTextRegular>
              </Pressable>

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

              {/* note */}
              <LabelComponent label={"Note"} required={false} />
              <CustomTextInputField
                value={note}
                multiline={true}
                maxLength={250}
                placeholderTextColor={"#B9B9B9"}
                cursorColor={"#B9B9B9"}
                style={{ height: 75 }}
                labelColor={"#C5C5C5"}
                onChangeText={(e) => setNote(e)}
                className={` w-full  text-form-text-color 
              border border-border-color
              rounded-3xl px-6 py-3 mt-4 text-sm `}
              />

              {/* create event button */}
              <TouchableOpacity
                className={`${
                  !isValidForm ? "bg-primary-color" : "bg-[#6787e7]"
                } rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
                disabled={isValidForm ? true : false}
                onPress={handleEditEvent}
              >
                <CustomTextRegular className="text-center font-semibold text-white text-base">
                  Save Event
                </CustomTextRegular>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
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
      {/* lottie loading screen */}
      {(loadingEdit || loadingDelete) && (
        <LottieLoadingScreen loading={loadingEdit || loadingDelete} />
      )}

      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={"Event updated"}
          type={"success"}
        />
      )}
    </Swipeable>
  );
};

// Exporting the component
export default React.memo(AgendaItem);
