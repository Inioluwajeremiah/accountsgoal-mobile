import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import EditTodoIcon from "../../../Icons/EditTodoIcon";
import CustomTextRegular from "../../../components/CustomTextRegular";
import AngleRightIcon from "../../../Icons/AngleRightIcon";
import GoalIcon from "../../../Icons/GoalIcon";
import TodoListIcon from "../../../Icons/TodoListIcon";

const MapTakeActionModal = ({
  showTakeActionModal,
  handleToggleTakeActionModal,
}) => {
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
            className="h-[60%] "
            onPress={handleToggleTakeActionModal}
          />

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            className="px-5  w-full h-[45%] flex flex-col  rounded-t-3xl  bg-screen-bg"
          >
            <View className="py-6 ">
              {/* note card */}
              <TouchableOpacity className="w-full relative flex flex-row items-top  mt-6">
                {/* note icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <EditTodoIcon color={"#4169E1"} />
                </View>
                {/* note title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Edit notes</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color">
                    Update details quickly and easily.
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
              {/* goal card */}
              <TouchableOpacity className="w-full relative flex flex-row items-top  mt-6">
                {/* goal icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <GoalIcon color={"#4169E1"} />
                </View>
                {/* goal title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Set goals</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color">
                    Set goals to stay focused and drive performance.
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
              {/* todo list card */}
              <TouchableOpacity className="w-full relative flex flex-row items-top  mt-6">
                {/* todo icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <TodoListIcon color={"#4169E1"} />
                </View>
                {/* todo title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Add to do list</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color">
                    Track and prioritize activities effectively
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
      </Modal>
    </View>
  );
};

export default MapTakeActionModal;
