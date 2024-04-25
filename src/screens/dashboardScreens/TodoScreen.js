import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Modal,
  Switch,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import MenuIcon from "../../Icons/MenuIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import FilterIcon from "../../Icons/FilterIcon";
import SearchIcon from "../../Icons/SearchIcon";
import AddIcon from "../../Icons/AddIcon";
import LabelComponent from "../../components/LabelComponent";
import TextInputComponent from "../../components/TextInputComponent";
import CalendarIcon from "../../Icons/CalendarIcon";
import { customButtonWithIcon } from "../../utils/stylesVariable";
import IconCaretDropdown from "../../Icons/IconCaretDropdown";
import ClockIcon from "../../Icons/ClockIcon";
import {
  useCreateTodoMutation,
  useGetUserTodosQuery,
} from "../../slices/todoApiSlice";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector } from "react-redux";
import DropDownAlert from "../../components/DropDownAlert";
import { priorityData, toggleData } from "../../utils/dummyData";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";
import TodoTabs from "./dashboardComponents/TodoTabs";

const TodoScreen = ({ navigation }) => {
  const { accountsGoalUser, onboarding } = useSelector(
    (state) => state.acgUser
  );
  console.log("accountsGoalUser ===> ", accountsGoalUser);

  const [toggleModal, setToggleModal] = useState(false);
  const [togglePriority, setTogglePriority] = useState(false);
  const [toggleReminder, setToggleReminder] = useState(false);
  const [toggleNoEndDate, setToggleNoEndDate] = useState(false);
  const [toggleSearchModal, setToggleSearchModal] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [dateTimePickerMode, setDateTimePickerMode] = useState("date");
  const [dateTimePickerField, setDateTimePickerField] = useState("");
  const [eventName, setEventName] = useState("");
  // const [date, setDate] = useState(new Date())
  const [date, setDate] = useState(new Date());
  const [priority, setPriority] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [note, setNote] = useState("");
  const [todoSearchResult, setTodoSearchResult] = useState([]);
  const [filterPriority, setFilterPriority] = useState("");

  // const [pendingTodoData, setPendinTodoData] = useState([]);

  const isValidForm =
    !eventName || !date || !priority || !startTime || !endTime;

  const [createTodo, { isLoading: loadingCreateTodo, error: createTodoError }] =
    useCreateTodoMutation();

  const {
    data: userTodos,
    refetch,
    isLoading: loadingTodos,
    error: todoError,
  } = useGetUserTodosQuery(accountsGoalUser._id);

  const pendingTodoData =
    userTodos && userTodos.filter((item) => item.status === false);

  const completedTodoData =
    userTodos && userTodos.filter((item) => item.status === true);

  console.log("user todos ===> ", userTodos);
  console.log("user todos error ===> ", todoError);

  // if (!loadingTodos && userTodos) {
  //   const pendingTodoData = userTodos.filter((item) => item.status === false);
  //   setPendinTodoData(pendingTodoData);
  // }

  const handleToggleAddTodoModal = () => {
    setToggleModal(!toggleModal);
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
    setShowDateTimePicker(true);
    setDateTimePickerMode(mode);
    setDateTimePickerField(field);
  };

  const handleCreateTodo = async () => {
    const body = {
      user: accountsGoalUser._id,
      eventName: eventName,
      date: date.toString(),
      setPirority: priority,
      noEndDate: toggleNoEndDate,
      startTime: startTime.toString(),
      endTime: endTime.toString(),
      setReminder: { active: toggleReminder, note: note },
      note: note,
    };
    try {
      const response = await createTodo(body);
      console.log("todo body ==>", body);
      console.log("todo ===> ", response);

      if (response.data) {
        refetch();
        setShowAlertModal(true);
        handleToggleAddTodoModal();
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

  const handleToggleSearchModal = () => {
    setToggleSearchModal(!toggleSearchModal);
  };
  const handleToggleFilter = () => {
    setToggleFilter(!toggleFilter);
  };
  const handleFilterPriority = (value) => {
    setFilterPriority(value);
    handleToggleFilter();
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
      }, 3000);
    }
  });
  return (
    <SafeAreaView className={`flex-1 bg-screen-bg`}>
      {/* header */}
      <View className="px-5 flex flex-row items-center bg-white pt-4 justify-between ">
        {/* menu */}
        <View className="flex flex-row items-center ">
          <TouchableOpacity
            className="h-12 w-12 rounded-full  flex flex-row justify-center items-center   "
            onPress={() => navigation.openDrawer()}
          >
            <MenuIcon />
          </TouchableOpacity>

          <CustomTextRegular className="font-bold text-xl  ml-2">
            To-do list
          </CustomTextRegular>
        </View>

        {/* search and filter icon */}
        <View className="flex flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("searchTodo", userTodos)}
          >
            <SearchIcon />
          </TouchableOpacity>
          <TouchableOpacity className="ml-2" onPress={handleToggleFilter}>
            <FilterIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* todo tabs */}
      <TodoTabs
        pendingTodoData={pendingTodoData}
        filterPriority={filterPriority}
        loadingTodos={loadingTodos}
        toggleSearchModal={toggleSearchModal}
        handleToggleSearchModal={handleToggleSearchModal}
        completedTodoData={completedTodoData}
        refetch={refetch}
      />

      {/* add icon */}
      <TouchableOpacity
        className="absolute right-10 bottom-10 w-[60px] h-[60px] rounded-full bg-primary-color flex items-center justify-center"
        onPress={handleToggleAddTodoModal}
      >
        <AddIcon color={"#fff"} />
      </TouchableOpacity>

      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={"To do list created"}
          type={"success"}
        />
      )}

      {/******************** add todo modal *************************/}
      {toggleModal && (
        <Modal transparent={true} visible={toggleModal} animationType="slide">
          <View className="h-full w-full bg-transparent">
            <Pressable
              className="h-[17%] bg-black/50 "
              onPress={handleToggleAddTodoModal}
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
                  {date?.toDateString()}
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
                        ? "bg-high-priority"
                        : index === 1
                          ? "bg-medium-priority"
                          : "bg-low-priority"
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

              {/* <Pressable
                className={customButtonWithIcon + " justify-between"}
                onPress={handleTogglePriority}
              >
                <CustomTextRegular className=" text-sm text-form-text-color">
                  {priority}
                </CustomTextRegular>
                <IconCaretDropdown />
              </Pressable>
              {/* priority drop down */}
              {/* {togglePriority && (
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
              )} */}

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
              <LabelComponent label={"Note"} required={true} />
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

      {/* loading complete todo */}
      {loadingCreateTodo && (
        <LottieLoadingScreen loading={loadingCreateTodo} />
        // <Modal
        //   animationType="none"
        //   visible={loadingCreateTodo}
        //   transparent={true}
        // >
        //   <View className="flex-1 h-full w-full bg-black/30 justify-center items-center">
        //     <LottieView
        //       className="w-32 h-32"
        //       source={require("../../../assets/starloader.json")}
        //       autoPlay
        //       loop={true}
        //     />
        //   </View>
        // </Modal>
      )}

      {/* filter */}
      {toggleFilter && (
        <Modal animationType="none" visible={toggleFilter} transparent={true}>
          <View className="flex-1 h-full w-full bg-black/30 justify-center items-center">
            <Pressable className="w-full h-full" onPress={handleToggleFilter}>
              <View className="bg-white rounded-2xl p-5 w-fit self-end  mt-20  right-5">
                {priorityData.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    className="flex flex-row items-center my-2  "
                    onPress={() => handleFilterPriority(item.value)}
                  >
                    <View
                      className={`h-2 w-2 rounded-full ${index === 0 ? "bg-primary-accent-color" : index === 1 ? "bg-high-priority" : index === 2 ? "bg-medium-priority" : "bg-low-priority"}`}
                    />
                    <CustomTextRegular className="text-sm ml-5">
                      {item.title}
                    </CustomTextRegular>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default TodoScreen;
