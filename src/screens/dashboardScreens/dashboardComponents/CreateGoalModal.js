import {
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownAlert from "../../../components/DropDownAlert";
import IconCaretDropdown from "../../../Icons/IconCaretDropdown";
import CustomTextInputField from "../../../components/CustomTextInputField";
import CustomTextRegular from "../../../components/CustomTextRegular";
import LabelComponent from "../../../components/LabelComponent";
import CalendarIcon from "../../../Icons/CalendarIcon";
import { useSelector } from "react-redux";
import { useCreateGoalMutation } from "../../../slices/goalApiSlice";
import { useGetAllUsersQuery } from "../../../slices/usersApiSlice";
import TextInputComponent from "../../../components/TextInputComponent";
import { customButtonWithIcon } from "../../../utils/stylesVariable";
import { useGetExcelDataQuery } from "../../../slices/accountApiSlice";
import TickIcon from "../../../Icons/TickIcon";
import CloseButtonBigIcon from "../../../Icons/CloseButtonBigIcon";
import CloseButton from "../../../Icons/CloseButton";

const CreateGoalModal = ({ toggleModal, handleToggleModal, item }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [goalName, setGoalName] = useState("");
  const [date, setDate] = useState(new Date());
  const [toggleAttachClients, settoggleAttachClients] = useState(false);
  const [attachClientInput, setAttaChClientInput] = useState("");
  const [attachedClient, setAttachedClient] = useState(
    item?.ACCOUNT_NAME || ""
  );
  const [attachedClientUniqueId, setAttachedClientUniqueId] = useState(
    item?.uniqueId || ""
  );
  const [toggleNewSUbgoals, setToggleNewSubgoals] = useState(false);
  const [subgoalInput, setSubgoalInput] = useState("");
  const [subgoals, setSubgoals] = useState([]);
  const [selectedSubgoals, setSelectedSubgoals] = useState([]);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const isValidForm = !goalName || !date || !attachedClient;

  // create goal
  const [createGoal, { isLoading: loadingCreateGoal, error: createGoalError }] =
    useCreateGoalMutation();

  // get all users => replace with get excel
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

  const handleToggleAttachClient = () => {
    settoggleAttachClients(!toggleAttachClients);
  };

  const handleSelectClients = (item) => {
    setAttachedClient(item.ACCOUNT_NAME);
    setAttachedClientUniqueId(item.uniqueId);
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

  const handleToggleNewSubgoals = () => {
    setToggleNewSubgoals(!toggleNewSUbgoals);
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

  const handleCreateGoal = async () => {
    const body = {
      uniqueId: attachedClientUniqueId,
      user: accountsGoalUser._id,
      goalName: goalName,
      client: attachedClient,
      endDate: date.toString(),
      subGoals: selectedSubgoals,
    };

    try {
      const response = await createGoal(body);

      if (response.data) {
        // refetch();
        setShowAlertModal(true);
        setSubgoals([]);
        setSelectedSubgoals([]);
        setAttachedClient("");
        setDate(new Date());
      }

      if (response.error) {
        Alert.alert("", response.error.data.message);
      }
    } catch (error) {
      Alert.alert("", error.message);
    }
  };

  useEffect(() => {
    if (showAlertModal === true) {
      setTimeout(() => {
        setShowAlertModal(false);
        handleToggleModal();
      }, 1000);
    }
  });

  return (
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
        <TouchableOpacity
          className=" w-8 h-8 flex self-end items-center justify-center p-2 mt-5 mr-5"
          onPress={handleToggleModal}
        >
          <View className="w-8 h-8 rounded-full flex items-center justify-center border border-[#A8A8A8]">
            <CloseButtonBigIcon color={"#A8A8A8"} />
          </View>
        </TouchableOpacity>
        <KeyboardAvoidingView
          // behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {loadingUsers && <ActivityIndicator size="small" />}
          {/* goal name */}
          <LabelComponent label={"Goal Name"} required={true} />
          <TextInputComponent
            placeholder="e.g meeting, visit, reading"
            labelColor={"#B9B9B9"}
            onChangeText={(e) => setGoalName(e)}
          />
          {/* attachedClient */}
          <LabelComponent label={"Attach Client to Goals"} required={true} />

          <Pressable
            className={customButtonWithIcon + " justify-between"}
            onPress={item ? null : handleToggleAttachClient}
          >
            <CustomTextRegular className=" text-sm text-form-text-color">
              {attachedClient}
            </CustomTextRegular>
            <IconCaretDropdown />
          </Pressable>
          {/* attachedClient drop down */}
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
          <View className="w-full flex flex-row items-center mt-4 " key={index}>
            {/* check box */}
            <TouchableOpacity
              className="h-4 w-4 border border-black flex flex-row justify-center items-center"
              onPress={() => handleSelectSubgoals(index)}
            >
              {item.status === true ? <TickIcon /> : ""}
              {/* {selectedSubgoals.includes(item) && <TickIcon />} */}
            </TouchableOpacity>
            <CustomTextRegular className="ml-4">{item.title}</CustomTextRegular>
            <TouchableOpacity
              className="absolute right-0 w-4 h-4 flex items-center justify-center rounded-full  border border-[#000] "
              onPress={() => handleRemoveSubgoals(item)}
            >
              <CloseButton color={"#000"} />
            </TouchableOpacity>
          </View>
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
              style={{ backgroundColor: "#fff", width: "100%", height: "70%" }}
              minimumDate={new Date()}
            />
          </Pressable>
        </Modal>
      )}

      {/* alert */}
      {showAlertModal && (
        <DropDownAlert
          showAlertModal={showAlertModal}
          message={"Goal created"}
          type={"success"}
        />
      )}
    </Modal>
  );
};

export default CreateGoalModal;
