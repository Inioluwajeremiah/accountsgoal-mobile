import { ActivityIndicator, SectionList, View } from "react-native";
import React from "react";
import CustomTextRegular from "./CustomTextRegular";
import PendingTodoCard from "./PendingTodoCard";
import LoadingSpinner from "./LoadingSpinner";
import LottieLoadingScreen from "./LottieLoadingScreen";

const CompletedTodoComponent = ({ completedTodoData, loading, refetch }) => {
  const TodoSections = () => {
    const sections = {};
    completedTodoData &&
      completedTodoData.forEach((item) => {
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
        // ListHeaderComponent={HeaderComponent}
        renderSectionHeader={({ section: { title } }) => (
          <CustomTextRegular className="text-lg text-primary-accent-color font-semibold mt-10 mb-4">
            {title}
          </CustomTextRegular>
        )}
        stickySectionHeadersEnabled={false}
      />
      {loading && <LottieLoadingScreen loading={loading} />}
    </>
  );
};

export default CompletedTodoComponent;
