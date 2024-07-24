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
import {
  useGetTodoListByIdQuery,
  useGetUserTodosQuery,
} from "../../../slices/todoApiSlice";
import { useSelector } from "react-redux";
import GoalsList from "./GoalsList";
import {
  useGetAllGoalsQuery,
  useGetGoalQuery,
} from "../../../slices/goalApiSlice";
import { windowHeight } from "../../../utils/Dimensions";
import { useGetAllNotesByUniqueIdQuery } from "../../../slices/noteApiSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CloseButtonBigIcon from "../../../Icons/CloseButtonBigIcon";
import MapContactModal from "./MapContactModal";
import MapTakeActionModal from "./MapTakeActionModal";

const MapPreviewAccountModal = ({
  showPreviewAccount,
  handelToggleAccountPreview,
  handleToggleTakeActionModal,
  currentItem,
  loadingUploadExcelFile,
  handleToggleContactModal,
  uniqueId,
  showTakeActionModal,
  showContactModal,
}) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);

  const touchableHeight = windowHeight - 64;

  const {
    data: userTodos,
    refetch,
    isLoading: loadingTodos,
    error: todoError,
  } = useGetTodoListByIdQuery({ uniqueId: uniqueId });

  const {
    data: allGoals,
    refetch: refetchGoals,
    isLoading: loadingGoals,
    error: goalError,
  } = useGetGoalQuery({ uniqueId: uniqueId });

  // get last interaction from note
  // const lastInteraction =
  //   notesData &&
  //   notesData.data.noteUniqueId[notesData?.data.noteUniqueId.length - 1];

  const loadingNotesData = false;
  const lastInteraction = [];

  // get last text from note
  const allTextsInNotes = [];
  // notesData && notesData?.data?.noteUniqueId.filter((note) => note.textName);

  const pendingTodoData =
    userTodos && userTodos?.filter((item) => item.status === false);

  const completedTodoData =
    userTodos && userTodos?.filter((item) => item.status === true);

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

  const TodoModalHeaderComponent = () => (
    <CustomTextRegular className="text-xl font-black px-5 mt-6">
      To- do list
    </CustomTextRegular>
  );
  const GoalModalHeaderComponent = () => (
    <CustomTextRegular className="text-xl font-black px-5 mt-6 mb-4">
      Goals
    </CustomTextRegular>
  );
  return (
    <Modal
      className=" "
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
          // onPress={handelToggleAccountPreview}
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
              className=" w-8 h-8 flex self-end items-center justify-center p-2"
              onPress={handelToggleAccountPreview}
            >
              <View className="w-8 h-8 rounded-full flex items-center justify-center border border-[#A8A8A8]">
                <CloseButtonBigIcon color={"#A8A8A8"} />
              </View>
            </TouchableOpacity>
            <CustomTextRegular className="font-black leading-6 text-base text-black mb-6">
              {currentItem.ACCOUNT_NAME}
            </CustomTextRegular>
            {/* tags */}
            <View className="flex flex-row justify-between">
              {/* left view */}
              <View>
                {loadingNotesData ? (
                  <ActivityIndicator size={"small"} color={"#4169E1"} />
                ) : (
                  <>
                    <CustomTextRegular className="text-xs ">
                      Last Interaction:
                    </CustomTextRegular>
                    <View className="flex flex-row items-center">
                      {currentItem?.clickedAt ? (
                        <CustomTextRegular className="text-sm font-black mt-2">
                          {new Date(currentItem?.clickedAt).toDateString()}
                        </CustomTextRegular>
                      ) : (
                        <CustomTextRegular className="text-sm text-secondary-accent-color italic mt-2">
                          none
                        </CustomTextRegular>
                      )}
                      {currentItem?.meetingSummary ? (
                        <View className="rounded-full w-fit bg-orange px-2 py-1 ml-2 mt-2">
                          <CustomTextRegular className="text-[10px] font-bold text-white ">
                            {/* {lastInteraction?.textName
                                ? "Note"
                                : lastInteraction?.audioUrl
                                  ? "Audio"
                                  : lastInteraction?.imageUrl
                                    ? "Image"
                                    : ""} */}
                            {currentItem?.meetingSummary?.meetingType ===
                            "Video call"
                              ? "Video call"
                              : currentItem?.meetingSummary?.meetingType ===
                                  "Audio call"
                                ? "Audio call"
                                : currentItem?.meetingSummary?.meetingType ===
                                    "In-person"
                                  ? "In-person"
                                  : ""}
                          </CustomTextRegular>
                        </View>
                      ) : (
                        ""
                      )}
                    </View>
                  </>
                )}
              </View>
              {/* right view */}
              <View>
                <CustomTextRegular className="text-xs ">
                  Revenue
                </CustomTextRegular>
                <CustomTextRegular className="text-sm font-black mt-2">
                  {currentItem.REVENUE}
                </CustomTextRegular>
              </View>
            </View>
            {/* note */}
            <CustomTextRegular className="text-xs text-primary-accent-color leading-5 mt-4">
              {/* {allTextsInNotes &&
                  allTextsInNotes[allTextsInNotes?.length - 1]?.textName} */}
              {currentItem?.meetingSummary?.meetingContent}
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
                  Set personalized goals for your clients. Click to define
                  targets, track progress, and provide a clear roadmap for
                  success.
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
              {/* todo icon */}
              <View className="w-11 h-11 rounded-full bg-[#ECF0FC] flex items-center justify-center">
                <TodoListIcon color={"#4169E1"} />
              </View>
              {/* goal title and text */}
              <View className="w-[75%] ml-4">
                <CustomTextRegular>To do list</CustomTextRegular>
                <CustomTextRegular className="text-xs text-primary-accent-color">
                  Organize tasks efficiently. Click to create, track, and
                  complete your to-do list for better productivity
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

      {/* todo tabs */}
      {showTodoList && (
        <Modal transparent={true} visible={showTodoList} animationType="none">
          <View
            // style={{ marginTop: StatusBarHeight }}
            className="h-full w-full  "
          >
            <Pressable className="h-[25%] " onPress={handleToggleTodoList} />
            <View className=" w-full h-[80%]   rounded-t-3xl  bg-white">
              <TouchableOpacity
                className=" w-8 h-8 flex self-end items-center justify-center p-2 mt-5 mr-5"
                onPress={handleToggleTodoList}
              >
                <View className="w-8 h-8 rounded-full flex items-center justify-center border border-[#A8A8A8]">
                  <CloseButtonBigIcon color={"#A8A8A8"} />
                </View>
              </TouchableOpacity>
              <TodoTabs
                pendingTodoData={pendingTodoData}
                completedTodoData={completedTodoData}
                filterPriority={filterPriority}
                loadingTodos={loadingTodos}
                toggleSearchModal={toggleSearchModal}
                handleToggleSearchModal={handleToggleSearchModal}
                refetch={refetch}
                ModalHeaderComponent={TodoModalHeaderComponent}
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
            <Pressable className="h-[25%] " onPress={handleToggleGoalList} />
            <View className=" w-full h-[80%]   rounded-t-3xl  bg-white">
              <TouchableOpacity
                className=" w-8 h-8 flex self-end items-center justify-center p-2 mt-5 mr-5"
                onPress={handleToggleGoalList}
              >
                <View className="w-8 h-8 rounded-full flex items-center justify-center border border-[#A8A8A8]">
                  <CloseButtonBigIcon color={"#A8A8A8"} />
                </View>
              </TouchableOpacity>
              <GoalsList
                loadingGoals={loadingGoals}
                allGoals={allGoals}
                refetch={refetchGoals}
                ModalHeaderComponent={GoalModalHeaderComponent}
                isMap={true}
              />
            </View>
          </View>
        </Modal>
      )}

      {/******************** take action *************************/}
      {showTakeActionModal && (
        <MapTakeActionModal
          showTakeActionModal={showTakeActionModal}
          handleToggleTakeActionModal={handleToggleTakeActionModal}
          uniqueId={currentItem.uniqueId}
          currentItem={currentItem}
          item={currentItem}
          handelToggleAccountPreview={handelToggleAccountPreview}
        />
      )}

      {/******************** contact modal *************************/}
      {showContactModal && (
        <MapContactModal
          showContactModal={showContactModal}
          handleToggleContactModal={handleToggleContactModal}
          currentItem={currentItem}
        />
      )}
    </Modal>
  );
};

export default MapPreviewAccountModal;
