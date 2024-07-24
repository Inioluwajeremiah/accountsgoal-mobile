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
import LottieLoadingScreen from "./LottieLoadingScreen";

const PendingTodoComponent = ({ pendingTodoData, loading, refetch }) => {
  const TodoSections = () => {
    const sections = {};
    pendingTodoData &&
      pendingTodoData.forEach((item) => {
        const date = item.endDate;
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
      <SectionList
        className="px-5"
        sections={sections}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <PendingTodoCard item={item} refetch={refetch} />
        )}
        // ListHeaderComponent={ModalHeaderComponent}
        renderSectionHeader={({ section: { title } }) => (
          <CustomTextRegular className="text-sm  text-primary-accent-color font-semibold mt-10 mb-4">
            {title}
          </CustomTextRegular>
        )}
        stickySectionHeadersEnabled={false}
      />
      {/* loading pending todos */}
      {loading && <LottieLoadingScreen loading={loading} />}
    </>
  );
};

export default PendingTodoComponent;
