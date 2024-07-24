import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import React, { useState } from "react";
import MenuIcon from "../../Icons/MenuIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import SearchIcon from "../../Icons/SearchIcon";
import AddIcon from "../../Icons/AddIcon";
import {
  useCreateGoalMutation,
  useDeleteGoalMutation,
  useGetAllGoalsQuery,
  useGetColorStatusQuery,
} from "../../slices/goalApiSlice";
import { useGetAllUsersQuery } from "../../slices/usersApiSlice";
import { useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import GoalsList from "./dashboardComponents/GoalsList";
import CreateGoalModal from "./dashboardComponents/CreateGoalModal";
import { status_bar_height } from "../../utils/Dimensions";
import NoGoalsIcon from "../../Icons/NoGoalsIcon";
import LottieLoadingScreen from "../../components/LottieLoadingScreen";

const GoalsScreen = ({ navigation }) => {
  const { accountsGoalUser } = useSelector((state) => state.acgUser);
  const [toggleModal, setToggleModal] = useState(false);

  const [deleteGoal, { isLoading: loadingDelete, error: deleteError }] =
    useDeleteGoalMutation();

  // filter users
  // const filteredClientData =
  //   attachClientInput &&
  //   allUsers &&
  //   allUsers.filter((user) =>
  //     user.email.toLowerCase().includes(attachClientInput.toLocaleLowerCase())
  //   );

  // get all goals by user
  const {
    data: allGoals,
    refetch,
    isLoading: loadingGoals,
    error: goalError,
  } = useGetAllGoalsQuery({ user: accountsGoalUser?._id });

  const handleToggleModal = () => {
    setToggleModal(!toggleModal);
  };

  {
    /* header */
  }
  const headerComponent = () => {
    return (
      <View className="flex flex-row items-center justify-between my-4 ">
        {/* menu */}
        <View className=" flex flex-row items-center">
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

        {/* search  icon */}
        <View className="flex flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.navigate("searchGoals", allGoals)}
          >
            <SearchIcon />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView
      className={`flex-1 bg-[#F6F6F6] `}
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      <GoalsList
        loadingGoals={loadingGoals}
        allGoals={allGoals && allGoals}
        // refetch={refetch}
        modalHeader={false}
        ModalHeaderComponent={headerComponent}
      />

      {/* add icon */}
      <TouchableOpacity
        className="absolute right-10 bottom-10 w-[60px] h-[60px] rounded-full bg-primary-color flex items-center justify-center"
        onPress={handleToggleModal}
      >
        <AddIcon color={"#fff"} />
      </TouchableOpacity>

      {/******************** add goal modal *************************/}
      {toggleModal && (
        <CreateGoalModal
          toggleModal={toggleModal}
          handleToggleModal={handleToggleModal}
        />
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
    </SafeAreaView>
  );
};

export default GoalsScreen;
