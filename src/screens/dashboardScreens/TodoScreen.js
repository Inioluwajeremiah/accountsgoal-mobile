import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import MenuIcon from "../../Icons/MenuIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import FilterIcon from "../../Icons/FilterIcon";
import SearchIcon from "../../Icons/SearchIcon";
import AddIcon from "../../Icons/AddIcon";

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
import CreateTodoModal from "./dashboardComponents/CreateTodoModal";
import { status_bar_height } from "../../utils/Dimensions";
import NoTodoIcon from "../../Icons/NoTodoIcon";

const TodoScreen = ({ navigation }) => {
  const { accountsGoalUser, onboarding } = useSelector(
    (state) => state.acgUser
  );

  const [toggleModal, setToggleModal] = useState(false);
  const [toggleSearchModal, setToggleSearchModal] = useState(false);
  const [toggleFilter, setToggleFilter] = useState(false);
  const [todoSearchResult, setTodoSearchResult] = useState([]);
  const [filterPriority, setFilterPriority] = useState("");

  // const [pendingTodoData, setPendinTodoData] = useState([]);

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

  const handleToggleAddTodoModal = () => {
    setToggleModal(!toggleModal);
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

  return (
    <SafeAreaView
      className={`flex-1 bg-screen-bg`}
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      {/* header */}
      <View className="px-5 flex flex-row items-center bg-white justify-between py-4 ">
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
            onPress={() =>
              navigation.navigate("searchTodo", {
                userTodos: userTodos,
                refetch: refetch,
              })
            }
          >
            <SearchIcon />
          </TouchableOpacity>
          <TouchableOpacity className="ml-4" onPress={handleToggleFilter}>
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

      {/******************** add todo modal *************************/}
      {toggleModal && (
        <CreateTodoModal
          toggleModal={toggleModal}
          handleToggleAddTodoModal={handleToggleAddTodoModal}
        />
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
