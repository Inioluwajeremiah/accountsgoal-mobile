import { View, Text, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import GoalsCard from "../../../components/GoalsCard";

const GoalsList = ({ loadingGoals, allGoals, refetch }) => {
  return (
    <View>
      {loadingGoals ? (
        <View className="flex-1 h-full justify-center items-center">
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
    </View>
  );
};

export default GoalsList;
