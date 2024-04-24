import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import CloseButton from "../../../Icons/CloseButton";
import CustomTextRegular from "../../../components/CustomTextRegular";
import AngleRightIcon from "../../../Icons/AngleRightIcon";
import TodoListIcon from "../../../Icons/TodoListIcon";
import ContactIcon from "../../../Icons/ContactIcon";
import GoalIcon from "../../../Icons/GoalIcon";
import { useState } from "react";
import TodoTabs from "./TodoTabs";
import { useGetUserTodosQuery } from "../../../slices/todoApiSlice";
import { useSelector } from "react-redux";
import GoalsList from "./GoalsList";
import { useGetAllGoalsQuery } from "../../../slices/goalApiSlice";

const MapPreviewAccountModal = ({
  showPreviewAccount,
  handelToggleAccountPreview,
  handleToggleTakeActionModal,
  currentItem,
  loadingUploadExcelFile,
  handleToggleContactModal,
}) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  const {
    data: userTodos,
    refetch,
    isLoading: loadingTodos,
    error: todoError,
  } = useGetUserTodosQuery(accountsGoalUser._id);

  const {
    data: allGoals,
    refetch: refetchGoals,
    isLoading: loadingGoals,
    error: goalError,
  } = useGetAllGoalsQuery({ user: accountsGoalUser._id });

  const pendingTodoData =
    userTodos && userTodos.filter((item) => item.status === false);
  const [showTodoList, setShowTodoList] = useState(false);
  const [showGoalList, setShowGoalList] = useState(false);
  const [filterPriority, setFilterPriority] = useState("");
  const [toggleSearchModal, setToggleSearchModal] = useState(false);

  const handleToggleTodoList = () => {
    setShowTodoList(!showTodoList);
  };
  const handleToggleGoalList = () => {
    setShowGoalList(!showGoalList);
  };
  const handleToggleSearchModal = () => {
    setToggleSearchModal(!toggleSearchModal);
  };
  return (
    <View>
      <Modal
        transparent={true}
        visible={showPreviewAccount}
        animationType="none"
      >
        <View
          // style={{ marginTop: StatusBarHeight }}
          className="h-full w-full "
        >
          <Pressable
            className="h-[45%] "
            onPress={handelToggleAccountPreview}
          />

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
            className="px-5  w-full h-[60%] flex flex-col  rounded-t-3xl  bg-screen-bg"
          >
            <View className="py-6 ">
              <TouchableOpacity
                className=" w-8 h-8 flex self-end items-center justify-center  p-2"
                onPress={handelToggleAccountPreview}
              >
                <View className="w-6 h-6 rounded-full flex items-center justify-center border border-[#A8A8A8]">
                  <CloseButton color={"#A8A8A8"} />
                </View>
              </TouchableOpacity>
              <CustomTextRegular className="font-black leading-6 text-base text-black mb-6">
                {currentItem.ACCOUNT_NAME}
              </CustomTextRegular>
              {/* tags */}
              <View className="flex flex-row justify-between">
                {/* left view */}
                <View>
                  <CustomTextRegular className="text-xs ">
                    Last Interaction:{" "}
                  </CustomTextRegular>
                  <View className="flex flex-row items-center">
                    <CustomTextRegular className="text-sm font-black mt-2">
                      51 days ago
                    </CustomTextRegular>
                    <View className="rounded-full w-fit bg-orange px-2 py-1 ml-2 mt-2">
                      <CustomTextRegular className="text-[10px] font-bold text-white ">
                        Video call
                      </CustomTextRegular>
                    </View>
                  </View>
                </View>
                {/* right view */}
                <View>
                  <CustomTextRegular className="text-xs ">
                    Revenue
                  </CustomTextRegular>
                  <CustomTextRegular className="text-sm font-black mt-2">
                    $400,000
                  </CustomTextRegular>
                </View>
              </View>
              {/* note */}
              <CustomTextRegular className="text-xs text-primary-accent-color leading-5 mt-4">
                Recently updated with the latest transactional data for enhanced
                accuracy in sales tracking and performance analysis on the 5th
                March 2024...
              </CustomTextRegular>
              {/* goal card */}
              <TouchableOpacity
                className="w-full relative flex flex-row items-top  mt-4"
                onPress={handleToggleGoalList}
              >
                {/* goal icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <GoalIcon color={"#4169E1"} />
                </View>
                {/* goal title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>Goal</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color">
                    Increase revenue generated, 13 interaction with clients,
                    Upgrade account.
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
              {/* todo list card */}
              <TouchableOpacity
                className="w-full relative flex flex-row items-top  mt-4"
                onPress={handleToggleTodoList}
              >
                {/* goal icon */}
                <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                  <TodoListIcon color={"#4169E1"} />
                </View>
                {/* goal title and text */}
                <View className="w-[75%] ml-4">
                  <CustomTextRegular>To do list</CustomTextRegular>
                  <CustomTextRegular className="text-xs text-primary-accent-color">
                    Increase revenue generated, 13 interaction with clients,
                    Upgrade account.
                  </CustomTextRegular>
                </View>
                {/* angle right icon */}
                <TouchableOpacity className="absolute right-0 top-0">
                  <AngleRightIcon />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            {/* buttons */}
            <View className="flex flex-row items-center justify-between">
              {/* take an action button */}
              <TouchableOpacity
                className={`w-[80%] bg-primary-color rounded-full mt-4 h-12 py-3 flx justify-center items-center mb-10  `}
                disabled={false}
                onPress={handleToggleTakeActionModal}
              >
                <CustomTextRegular className="text-center font-semibold text-white text-base">
                  {loadingUploadExcelFile ? (
                    <ActivityIndicator size="small" color={"#fff"} />
                  ) : (
                    "Take an action"
                  )}
                </CustomTextRegular>
              </TouchableOpacity>
              {/* contact button */}
              <TouchableOpacity
                className={`w-12 h-12 bg-primary-color rounded-full mt-4 py-3 flx justify-center items-center mb-10  `}
                disabled={false}
                onPress={handleToggleContactModal}
              >
                <ContactIcon />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* todo tabs */}
      {showTodoList && (
        <Modal transparent={true} visible={showTodoList} animationType="none">
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full  "
          >
            <Pressable className="h-[45%] " onPress={handleToggleTodoList} />
            <View className=" w-full h-[60%]   rounded-t-3xl  bg-white">
              <CustomTextRegular className="text-xl font-black px-5 mt-6">
                To- do list
              </CustomTextRegular>
              <TodoTabs
                pendingTodoData={pendingTodoData}
                filterPriority={filterPriority}
                loadingTodos={loadingTodos}
                toggleSearchModal={toggleSearchModal}
                handleToggleSearchModal={handleToggleSearchModal}
                refetch={refetch}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* goals */}
      {showGoalList && (
        <Modal transparent={true} visible={showGoalList} animationType="none">
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full  "
          >
            <Pressable className="h-[45%] " onPress={handleToggleGoalList} />
            <View className=" w-full h-[60%]   rounded-t-3xl  bg-white">
              <CustomTextRegular className="text-xl font-black px-5 mt-6">
                Goals
              </CustomTextRegular>
              <GoalsList
                loadingGoals={loadingGoals}
                allGoals={allGoals}
                refetch={refetchGoals}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default MapPreviewAccountModal;
