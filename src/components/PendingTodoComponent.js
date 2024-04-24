import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SectionList,
  Modal,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomTextRegular from "./CustomTextRegular";
import PendingTodoCard from "./PendingTodoCard";
import CustomTextInputField from "./CustomTextInputField";
import CloseButton from "../Icons/CloseButton";
import { TextInput } from "react-native-gesture-handler";

const PendingTodoComponent = ({
  pendingTodoData,
  loading,
  refetch,
  handleToggleSearchModal,
}) => {
  const TodoSections = () => {
    const sections = {};
    pendingTodoData &&
      pendingTodoData.forEach((item) => {
        const date = item.date;
        if (sections[date]) {
          sections[date].push(item);
        } else {
          sections[date] = [item];
        }
      });
    return Object.entries(sections).map(([date, items]) => ({
      title: new Date(date).toDateString(),
      data: items,
    }));
  };

  const sections = TodoSections();

  return (
    <>
      {loading ? (
        <View className="flex-1 w-full flex justify-center items-center">
          <ActivityIndicator size="small" color="#4169E1" />
        </View>
      ) : (
        <SectionList
          className="px-5"
          sections={sections}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <PendingTodoCard item={item} refetch={refetch} />
          )}
          // ListHeaderComponent={HeaderComponent}
          renderSectionHeader={({ section: { title } }) => (
            <CustomTextRegular className="text-sm  text-primary-accent-color font-semibold mt-10 mb-4">
              {title}
            </CustomTextRegular>
          )}
        />
      )}
    </>
  );
};

export default PendingTodoComponent;
