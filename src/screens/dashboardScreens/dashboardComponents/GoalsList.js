import { View, Text, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import GoalsCard from "../../../components/GoalsCard";
import LottieLoadingScreen from "../../../components/LottieLoadingScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NoGoalsIcon from "../../../Icons/NoGoalsIcon";
import CustomTextRegular from "../../../components/CustomTextRegular";
import { status_bar_height, windowHeight } from "../../../utils/Dimensions";

const GoalsList = ({ loadingGoals, allGoals, ModalHeaderComponent }) => {
  return (
    <GestureHandlerRootView className="flex-1">
      {/* {!loadingGoals && allGoals?.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <NoGoalsIcon />
          <CustomTextRegular className="font-black text-lg text-black mt-4">
            No Goal set
          </CustomTextRegular>
        </View>
      )} */}
      {/* {!loadingGoals && allGoals?.length > 0 && ( */}
      <FlatList
        ListHeaderComponent={<ModalHeaderComponent />}
        keyExtractor={(item) => item._id}
        className="px-5"
        scrollEnabled
        data={allGoals && allGoals}
        renderItem={({ item, index }) => (
          <GoalsCard
            item={item}
            index={index}
            lastIndex={allGoals.length - 1}
          />
        )}
        ListFooterComponent={
          allGoals?.length === 0 && (
            <View
              className="flex-1 flex flex-col items-center justify-center"
              style={{ height: windowHeight - 2 * status_bar_height - 160 }}
            >
              <NoGoalsIcon />
              <CustomTextRegular className="font-black text-lg text-black mt-4">
                No Goal set
              </CustomTextRegular>
            </View>
          )
        }
      />
      {/* )} */}
      {/* loading goals */}
      {loadingGoals && <LottieLoadingScreen loading={loadingGoals} />}
    </GestureHandlerRootView>
  );
};

export default GoalsList;
