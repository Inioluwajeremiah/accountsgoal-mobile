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
  FlatList,
  Text,
} from "react-native";
import React, { useEffect, useState } from "react";
import MenuIcon from "../../Icons/MenuIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import SearchIcon from "../../Icons/SearchIcon";
import AddIcon from "../../Icons/AddIcon";

import LabelComponent from "../../components/LabelComponent";
import TextInputComponent from "../../components/TextInputComponent";
import CalendarIcon from "../../Icons/CalendarIcon";
import { customButtonWithIcon } from "../../utils/stylesVariable";
import IconCaretDropdown from "../../Icons/IconCaretDropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  useCreateGoalMutation,
  useDeleteGoalMutation,
  useGetAllGoalsQuery,
} from "../../slices/goalApiSlice";
import GoalsCard from "../../components/GoalsCard";
import TickIcon from "../../Icons/TickIcon";
import { useGetAllUsersQuery } from "../../slices/usersApiSlice";
import CustomTextInputField from "../../components/CustomTextInputField";
import { useSelector } from "react-redux";
import DropDownAlert from "../../components/DropDownAlert";
import LottieView from "lottie-react-native";

const GoalsScreen = ({ navigation }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const [toggleModal, setToggleModal] = useState(false);
  const [toggleAttachClients, settoggleAttachClients] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [date, setDate] = useState(new Date());
  // const [attachedClients, setAttachedClients] = useState([]);
  const [attachClientInput, setAttaChClientInput] = useState("");
  const [attachedClients, setAttachedClients] = useState("");
  const [toggleNewSUbgoals, setToggleNewSubgoals] = useState(false);
  const [subgoalInput, setSubgoalInput] = useState("");
  const [subgoals, setSubgoals] = useState([]);
  const [selectedSubgoals, setSelectedSubgoals] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const isValidForm = !goalName || !date || !attachedClients;

  console.log("selected subgoals ==> ", selectedSubgoals);
  // create goal
  const [createGoal, { isLoading: loadingCreateGoal, error: createGoalError }] =
    useCreateGoalMutation();

  const [deleteGoal, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteGoalMutation();

  // get all users
  const {
    data: allUsers,
    isLoading: loadingUsers,
    error: userError,
  } = useGetAllUsersQuery();

  // filter users
  const filteredClientData =
    attachClientInput &&
    allUsers &&
    allUsers.filter((user) =>
      user.email.toLowerCase().includes(attachClientInput.toLocaleLowerCase())
    );

  // get all goals
  const {
    data: allGoals,
    refetch,
    isLoading: loadingGoals,
    error: goalError,
  } = useGetAllGoalsQuery({ user: accountsGoalUser._id });
  console.log("all goals ==> ", allGoals && allGoals);
  console.log("all goals error ==> ", goalError);
  console.log("loading all goals  ==> ", loadingGoals);

  const handleToggleModal = () => {
    setToggleModal(!toggleModal);
  };
  const handleToggleAttachClient = () => {
    settoggleAttachClients(!toggleAttachClients);
  };

  // const handleSelectClients = (value) => {
  //   setAttachedClients((prevArray) => {
  //     if (!prevArray.includes(value)) {
  //       return [...prevArray, value];
  //     } else {
  //       return prevArray.filter((item) => item !== value);
  //     }
  //   });
  // };

  const handleSelectClients = (value) => {
    setAttachedClients(value);
    // setAttaChClientInput("");
    handleToggleAttachClient();
  };

  const handleDateTimePicker = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDateTimePicker(false);
  };

  const handelToggleDateTimePickerMode = () => {
    setShowDateTimePicker(true);
  };

  console.log("createGoalError ==> ", createGoalError);

  const handleToggleNewSubgoals = () => {
    setToggleNewSubgoals(!toggleNewSUbgoals);
  };

  // const handleSetSubgoals = () => {
  //   if (subgoalInput.trim() !== "") {
  //     if (!toggleNewSUbgoals) {
  //       setSubgoals((prevGoals) => [...prevGoals, subgoalInput]);
  //       console.log("subgoals ===> ", subgoals);
  //       setSubgoalInput("");
  //     } else {
  //       setSubgoals((prevGoals) => [...prevGoals, subgoalInput]);
  //       console.log("subgoals ===> ", subgoals);
  //       setSelectedSubgoals((prevGoals) => [...prevGoals, subgoalInput]);
  //       console.log("subgoals ===> ", selectedSubgoals);
  //       setSubgoalInput("");
  //     }
  //   }
  // };

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
        console.log("subgoals ===> ", subgoals);
        setSubgoalInput("");
        setToggleNewSubgoals(false);
      } else {
        setSubgoals((prevGoals) => [
          ...prevGoals,
          { title: subgoalInput, status: true },
        ]);
        console.log("subgoals ===> ", subgoals);
        setSelectedSubgoals((prevGoals) => [
          ...prevGoals,
          { title: subgoalInput, status: true },
        ]);
        console.log("subgoals ===> ", selectedSubgoals);
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

  // const handleSelectSubgoals = (goal) => {
  //   setSelectedSubgoals((prevGoals) => {
  //     if (prevGoals.includes(goal)) {
  //       return prevGoals.filter((item) => item !== goal);
  //     } else {
  //       return [...prevGoals, goal];
  //     }
  //   });
  // };

  const handleCreateGoal = async () => {
    const body = {
      user: accountsGoalUser._id,
      goalName: goalName,
      client: attachedClients,
      endDate: date.toString(),
      subGoals: selectedSubgoals,
    };
    console.log("goal body ==>", body);
    try {
      const response = await createGoal(body);

      console.log("goal ===> ", response);
      if (response.data) {
        refetch();
        setShowAlertModal(true);
        handleToggleModal();
        setSubgoals([]);
        setSelectedSubgoals([]);
        setAttachedClients("");
        setDate(new Date());
      }

      if (response.error) {
        Alert.alert("", response.error.data.message);
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    const response = await deleteGoal({ id: id });
    console.log("delete response ==> ", response);
    if (response.data) {
      refetch();
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
    <SafeAreaView className={`flex-1 bg-[#F6F6F6]`}>
      {/* header */}
      <View className="px-5 flex flex-row items-center  mt-4 justify-between ">
        {/* menu */}
        <View className="flex flex-row items-center">
          <TouchableOpacity
            className="h-12 w-12 rounded-full flex flex-row justify-center items-center   "
            onPress={() => navigation.openDrawer()}
          >
            <MenuIcon />
          </TouchableOpacity>

          <CustomTextRegular className="font-bold text-xl  ml-2">
            Goals
          </CustomTextRegular>
        </View>

        {/* search and filter icon */}
        <View className="flex flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("searchGoals", allGoals)}
          >
            <SearchIcon />
          </TouchableOpacity>
        </View>
      </View>

      {loadingGoals ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={"small"} color={"#4169E1"} />
        </View>
      ) : (
        <FlatList
          keyExtractor={(item) => item._id}
          className="p-5"
          data={allGoals && allGoals.goals}
          renderItem={({ item, index }) => (
            <GoalsCard
              item={item}
              index={index}
              refetch={refetch}
              lastIndex={allGoals.goals.length - 1}
            />
          )}
          // maxSwipeDistance={150}
          // renderQuickActions={({index, item}) => QuickActions(index, item)}
          // renderQuickActions={({ index, item }) => (
          //   <View className="flex flex-1 flex-row items-center justify-end pl-4">
          //     <DeleteComponent
          //       onPressDelete={() => handleDeleteItem(item._id)}
          //     />
          //   </View>
          // )}
          // contentContainerStyle={styles.contentContainerStyle}
          // shouldBounceOnMount={true}
          // ItemSeparatorComponent={renderItemSeparator}
        />
      )}

      {/* add icon */}
      <TouchableOpacity
        className="absolute right-10 bottom-10 w-[60px] h-[60px] rounded-full bg-primary-color flex items-center justify-center"
        onPress={handleToggleModal}
      >
        <AddIcon color={"#fff"} />
      </TouchableOpacity>

      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={"Goal created"}
          type={"success"}
        />
      )}

      {/******************** add goal modal *************************/}
      {toggleModal && (
        <Modal transparent={true} visible={toggleModal} animationType="slide">
          <View className="h-full w-full">
            <Pressable
              className="h-[20%] bg-black/50"
              onPress={handleToggleModal}
            />
          </View>

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            className="absolute bottom-0 w-full h-[85%] rounded-t-3xl  bg-screen-bg px-5"
          >
            <KeyboardAvoidingView
              // behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
            >
              {loadingUsers && <ActivityIndicator size="small" />}
              {/* goal name */}
              <LabelComponent label={"Goal Name"} required={true} />
              <TextInputComponent
                placeholder="e.g meeting, visit , reading"
                labelColor={"#B9B9B9"}
                onChangeText={(e) => setGoalName(e)}
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
                  {attachedClients}
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
                  {filteredClientData &&
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
                              attachedClients.email === item.email
                                ? "text-black"
                                : "text-form-text-color"
                            }`}
                          >
                            {item.email}
                          </CustomTextRegular>
                        </Pressable>
                      </View>
                    ))}
                </View>
              )}

              {/* end date */}
              <LabelComponent label={"End Date"} required={true} />
              <Pressable
                className={customButtonWithIcon}
                onPress={handelToggleDateTimePickerMode}
              >
                <CalendarIcon color={"#B9B9B9"} />
                <CustomTextRegular className="ml-3 text-sm text-form-text-color">
                  {date.toDateString()}
                </CustomTextRegular>
              </Pressable>

              {/* add sub goals */}
              <LabelComponent label={"Sub Goals"} required={true} />
              <View className="w-full flex flex-row items-center mt-6">
                {/* check box */}
                <TouchableOpacity
                  className="py-2 pr-2"
                  onPressIn={handleToggleNewSubgoals}
                >
                  <View className="h-4 w-4 border border-black flex flex-row justify-center items-center">
                    {toggleNewSUbgoals && <TickIcon />}
                  </View>
                </TouchableOpacity>
                <CustomTextInputField
                  placeholder={"list item"}
                  placeholderTextColor={"#B9B9B9"}
                  cursorColor={"#B9B9B9"}
                  value={subgoalInput}
                  className={`flex-1 text-sm ml-4 h-12 focus:border-b focus:border-b-border-color ${
                    toggleNewSUbgoals && "-pb-2 border-b border-b-border-color"
                  }`}
                  onChangeText={(e) => setSubgoalInput(e)}
                  onSubmitEditing={handleSetSubgoals}
                />
              </View>
            </KeyboardAvoidingView>
            {/* list subgoals */}
            {selectedSubgoals.map((item, index) => (
              <TouchableOpacity
                className="w-full flex flex-row items-center mt-2 "
                key={index}
                onPress={() => handleSelectSubgoals(index)}
              >
                {/* check box */}
                <View className="h-4 w-4 border border-black flex flex-row justify-center items-center">
                  {/* {selectedSubgoals.some(
                    (goal) => goal.title === item.title
                  ) && <TickIcon />} */}
                  {item.status === true ? <TickIcon /> : ""}
                </View>
                <CustomTextRegular className="ml-4">
                  {item.title}
                </CustomTextRegular>
              </TouchableOpacity>
            ))}

            {/* create goals button */}
            <TouchableOpacity
              className={`${
                !isValidForm ? "bg-primary-color" : "bg-[#6787e7]"
              } rounded-full mt-10 h-12 py-3 flx justify-center items-center mb-10`}
              disabled={isValidForm ? true : false}
              onPress={handleCreateGoal}
            >
              <CustomTextRegular className="text-center font-semibold text-white text-base">
                {loadingCreateGoal ? (
                  <ActivityIndicator size="small" color={"#fff"} />
                ) : (
                  "Create Goal"
                )}
              </CustomTextRegular>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
      )}

      {/* loading animation */}
      {loadingDelete && (
        <Modal animationType="none" visible={loadingDelete} transparent={true}>
          <View className="flex-1 h-full w-full bg-black/30 justify-center items-center">
            <LottieView
              className="w-32 h-32"
              source={require("../../../assets/starloader.json")}
              autoPlay
              loop={true}
            />
          </View>
        </Modal>
      )}

      {/* date time picker */}
      {showDateTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          is24Hour={false}
          onChange={handleDateTimePicker}
        />
      )}
    </SafeAreaView>
  );
};

export default GoalsScreen;
