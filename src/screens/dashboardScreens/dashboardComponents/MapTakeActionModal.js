import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import EditTodoIcon from "../../../Icons/EditTodoIcon";
import CustomTextRegular from "../../../components/CustomTextRegular";
import AngleRightIcon from "../../../Icons/AngleRightIcon";
import GoalIcon from "../../../Icons/GoalIcon";
import TodoListIcon from "../../../Icons/TodoListIcon";
import { useNavigation } from "@react-navigation/native";
import CreateTodoModal from "./CreateTodoModal";
import CreateGoalModal from "./CreateGoalModal";
import { uniqueId } from "lodash";
import CreateSummaryModal from "./CreateSummaryModal";
import LastInteractionIcon from "../../../Icons/LastInteraction";
import AutomatedEmailIcon from "../../../Icons/AutomatedEmailIcon";

const MapTakeActionModal = ({
  showTakeActionModal,
  handleToggleTakeActionModal,
  handelToggleAccountPreview,
  uniqueId,
  item,
}) => {
  const navigation = useNavigation();

  const [toggleCreateTodoModal, setToggleCreateTodoModal] = useState(false);
  const [toggleCreateGoalModal, setToggleCreateGoalModal] = useState(false);
  const [toggleCreateSummaryModal, setToggleCreateSummaryModal] =
    useState(false);

  const handleToggleCreateGoalModal = () => {
    setToggleCreateGoalModal(!toggleCreateGoalModal);
  };
  const handleToggleCreateTodoModal = () => {
    setToggleCreateTodoModal(!toggleCreateTodoModal);
  };
  const handleToggleCreateSummaryModal = () => {
    setToggleCreateSummaryModal(!toggleCreateSummaryModal);
  };

  const handleCloseModal = () => {
    handelToggleAccountPreview();
    handleToggleTakeActionModal();
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={showTakeActionModal}
        animationType="none"
      >
        <View
          // style={{ marginTop: StatusBarHeight }}
          className="h-full w-full bg-black/50 "
        >
          <Pressable
            className="h-[45%] "
            onPress={handleToggleTakeActionModal}
          />

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            className="px-5  w-full h-[60%] flex flex-col  rounded-t-3xl  bg-screen-bg"
          >
            <View className="py-6 ">
              {/* note card */}
              <TouchableOpacity
                className="w-full relative flex flex-row items-top  mt-6"
                onPress={() => {
                  handleCloseModal();
                  navigation.navigate("notes", { uniqueId });
                }}
              >
                {/* note icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <EditTodoIcon color={"#4169E1"} />
                </View>
                {/* note title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Edit notes</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color mt-2">
                    Update details quickly and easily.
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
              {/* goal card */}
              <TouchableOpacity
                className="w-full relative flex flex-row items-top  mt-6"
                onPress={handleToggleCreateGoalModal}
              >
                {/* goal icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <GoalIcon color={"#4169E1"} />
                </View>
                {/* goal title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Set goals</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color mt-2">
                    Set goals to stay focused and drive performance.
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
              {/* todo list card */}
              <TouchableOpacity
                className="w-full relative flex flex-row items-top  mt-6"
                onPress={handleToggleCreateTodoModal}
              >
                {/* todo icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <TodoListIcon color={"#4169E1"} />
                </View>
                {/* todo title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Add to do list</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color mt-2">
                    Track and prioritize activities effectively
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
              {/* summary card */}
              <TouchableOpacity
                className="w-full relative flex flex-row items-top  mt-6"
                onPress={handleToggleCreateSummaryModal}
              >
                {/* last interaction icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <LastInteractionIcon color={"#4169E1"} />
                </View>
                {/* last interaction title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Last interaction</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color mt-2">
                    Add summary of last interaction
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
              {/* automated email card */}
              <TouchableOpacity
                className="w-full relative flex flex-row items-top  mt-6"
                onPress={() => {
                  handleCloseModal();
                  navigation.navigate("notification", { uniqueId: uniqueId });
                }}
              >
                {/* automated email icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <AutomatedEmailIcon color={"#4169E1"} />
                </View>
                {/* automated email and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Automated email</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color mt-2">
                    Edit and send auto-generated email to clients
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/******************** add todo modal *************************/}
        {toggleCreateTodoModal && (
          <CreateTodoModal
            toggleModal={toggleCreateTodoModal}
            handleToggleAddTodoModal={handleToggleCreateTodoModal}
            item={item}
          />
        )}

        {/******************** add goal modal *************************/}
        {toggleCreateGoalModal && (
          <CreateGoalModal
            toggleModal={toggleCreateGoalModal}
            handleToggleModal={handleToggleCreateGoalModal}
            item={item}
          />
        )}

        {/******************** add summary based on last interaction *************************/}
        {toggleCreateSummaryModal && (
          <CreateSummaryModal
            toggleModal={toggleCreateSummaryModal}
            handleToggleModal={handleToggleCreateSummaryModal}
            item={item}
            handleToggleTakeActionModal={handleToggleTakeActionModal}
            uniqueId={uniqueId}
          />
        )}
      </Modal>
    </View>
  );
};

export default MapTakeActionModal;
