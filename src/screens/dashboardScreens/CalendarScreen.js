import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MenuIcon from "../../Icons/MenuIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import SearchIcon from "../../Icons/SearchIcon";
import AddIcon from "../../Icons/AddIcon";
import LabelComponent from "../../components/LabelComponent";
import CalendarIcon from "../../Icons/CalendarIcon";
import { customButtonWithIcon } from "../../utils/stylesVariable";
import ClockIcon from "../../Icons/ClockIcon";
import DateTimePicker from "@react-native-community/datetimepicker";
import LocationIcon from "../../Icons/LocationIcon";
import MeetinIcon from "../../Icons/MeetinIcon";
import AiIcon from "../../Icons/AiIcon";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
} from "react-native-calendars";
import { agendaItems, getMarkedDates } from "../../utils/dummyData";
import { getTheme, lightThemeColor, themeColor } from "../../utils/themse";
import AgendaItem from "../../Icons/AgendaItem";
import {
  useCreateEventMutation,
  useGetUserEventsQuery,
} from "../../slices/eventApiSlice";
import CustomTextInputField from "../../components/CustomTextInputField";
import { useSelector } from "react-redux";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import DropDownAlert from "../../components/DropDownAlert";

const ITEMS = agendaItems;

const Props = {
  weekView: undefined,
};

const CalendarScreen = ({ navigation, route }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const [toggleAiModal, setToggleAiModal] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState("date");
  const [dateTimePickerField, setDateTimePickerField] = useState("");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [note, setNote] = useState("");
  const { weekView } = Props;
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  const [
    createEvent,
    { isLoading: loadingCreateEvent, error: createEventError },
  ] = useCreateEventMutation();

  const {
    data: allEvents,
    refetch,
    isLoading: loadingEvents,
    error: eventError,
  } = useGetUserEventsQuery({ userId: accountsGoalUser?._id });

  const newData =
    allEvents &&
    allEvents.map((item, index) => {
      return {
        title: new Date(item?.date).toISOString().split("T")[0],
        data: [
          {
            id: index + 1,
            _id: item?._id,
            createdAt: item?.createdAt,
            date: item?.date,
            endTime: item?.endTime,
            eventName: item?.eventName,
            location: item?.location,
            meetingLink: item?.meetingLink,
            note: item?.note,
            startTime: item?.startTime,
            updatedAt: item?.updatedAt,
            user: item?.user,
            mode: item?.mode ? item?.mode : "ai",
          },
        ],
      };
    });

  const renderItem = useCallback(({ item }) => {
    return <AgendaItem item={item} refetch={refetch} />;
  }, []);

  const isValidForm = !eventName || !date || !startTime || !endTime;

  const handleToggleAddEventModal = () => {
    setToggleModal(!toggleModal);
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
    setShowDateTimePicker(true);
    setDateTimePickerMode(mode);
    setDateTimePickerField(field);
  };

  const handleCreateEvent = async () => {
    const body = {
      user: accountsGoalUser?._id,
      eventName: eventName,
      location: location,
      meetingLink: meetingLink,
      date: date.toString(),
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      note: note,
      mode: "manual",
    };
    try {
      const response = await createEvent(body);
      if (response.data) {
        refetch();
        setShowAlertModal(true);
        handleToggleAddEventModal();
        setEventName("");
        setDate(new Date());
        setMeetingLink("");
        setLocation("");
        setStartTime(new Date());
        setEndTime(new Date());

        setNote("");
      }

      if (response.error) {
        Alert.alert("", response.error.data.message);
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  const handleToggleAiModal = () => {
    setToggleAiModal(!toggleAiModal);
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
      }, 3000);
    }
  });

  // const MyStatusBar = ({ backgroundColor, ...props }) => (
  //   <View style={[styles.statusBar, { backgroundColor }]}>
  //     <SafeAreaView>
  //       <StatusBar translucent backgroundColor={backgroundColor} {...props} />
  //     </SafeAreaView>
  //   </View>
  // );

  return (
    <SafeAreaView className={`flex-1 bg-screen-bg`}>
      {/* header */}
      {/* <MyStatusBar backgroundColor="#f6f6f6" barStyle="dark-content" />; */}
      <View className="px-5 py-2 flex flex-row items-center justify-between  bg-white">
        {/* menu */}
        <View className="flex flex-row items-center">
          <TouchableOpacity
            className="h-12 w-12 rounded-full  flex flex-row justify-center items-center   "
            onPress={() => navigation.openDrawer()}
          >
            <MenuIcon />
          </TouchableOpacity>

          <CustomTextRegular className="font-bold text-xl  ml-2">
            Calendar
          </CustomTextRegular>
        </View>

        {/* search and filter icon */}
        <View className="flex flex-row items-center">
          <TouchableOpacity>
            <SearchIcon />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2" onPress={handleToggleAiModal}>
            <AiIcon />
          </TouchableOpacity>
        </View>
      </View>
      {newData && newData.length > 0 && (
        <CalendarProvider
          // date={ITEMS[1]?.title}
          date={newData.length > 0 && newData[0]?.title}
          // onDateChanged={onDateChanged}
          // onMonthChange={onMonthChange}
          showTodayButton
          // disabledOpacity={0.6}
          theme={todayBtnTheme.current}
          // todayBottomMargin={16}
        >
          {weekView ? (
            <WeekCalendar
              testID={"weekCalendar"}
              firstDay={1}
              markedDates={marked.current}
            />
          ) : (
            <ExpandableCalendar
              testID={"expandable_calendar_btn"}
              // horizontal={false}
              // hideArrows
              // disablePan
              // hideKnob
              // initialPosition={ExpandableCalendar.positions.OPEN}
              // calendarStyle={styles.calendar}
              // headerStyle={styles.header} // for horizontal only
              // disableWeekScroll
              theme={theme.current}
              // disableAllTouchEventsForDisabledDays
              firstDay={1}
              markedDates={marked.current}
              // leftArrowImageSource={() => <LeftAngleIcon />}
              // rightArrowImageSource={rightArrowIcon}
              animateScroll
              // closeOnDayPress={false}
              allowShadow={false}
            />
          )}
          <AgendaList
            // sections={ITEMS}
            className="px-5"
            sections={newData && newData}
            renderItem={newData && renderItem}
            // scrollToNextEvent
            sectionStyle={styles.section}
            // dayFormat={'yyyy-MM-d'}
          />
        </CalendarProvider>
      )}
      {/* add icon */}
      <TouchableOpacity
        className="absolute right-10 bottom-10 w-[60px] h-[60px] rounded-full bg-primary-color flex items-center justify-center"
        onPress={handleToggleAddEventModal}
      >
        <AddIcon color={"#fff"} />
      </TouchableOpacity>

      {/******************** add Event modal *************************/}
      {toggleModal && (
        <Modal transparent={true} visible={toggleModal} animationType="slide">
          <View className="h-full w-full">
            <Pressable
              className="h-[15%] bg-black/50"
              onPress={handleToggleAddEventModal}
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
                  {date.toDateString()}
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
                onPress={handleCreateEvent}
              >
                <CustomTextRegular className="text-center font-semibold text-white text-base">
                  {loadingCreateEvent ? (
                    <ActivityIndicator size="small" color={"#fff"} />
                  ) : (
                    "Create Event"
                  )}
                </CustomTextRegular>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      )}
      {/* Ai modal */}
      {toggleAiModal && (
        <Modal visible={toggleAiModal} transparent={true} animationType="none">
          <Pressable
            className="absolute top-0 w-full h-full bg-black/50"
            onPress={handleToggleAiModal}
          >
            <TouchableOpacity className=" w-[90%] absolute  top-20 bg-white rounded-2xl px-4 py-2 flex flex-row self-center items-center justify-between h-16">
              <View className="flex flex-row items-center">
                <CalendarIcon color={"#000"} />
                <CustomTextRegular className="text-sm ml-4">
                  Schedule meetings with AI{" "}
                </CustomTextRegular>
              </View>
              <AiIcon />
            </TouchableOpacity>
          </Pressable>
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
      {/* lottie loader */}
      {loadingCreateEvent && (
        <LottieLoadingScreen loading={loadingCreateEvent} />
      )}
      {/* lottie loader */}
      {loadingEvents && <LottieLoadingScreen loading={loadingEvents} />}
      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={"Event created"}
          type={"success"}
        />
      )}
    </SafeAreaView>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: "lightgrey",
  },
  section: {
    backgroundColor: lightThemeColor,
    color: "grey",
    textTransform: "capitalize",
  },
});
