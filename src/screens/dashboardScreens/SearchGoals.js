import {
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Platform,
} from "react-native";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import CloseButton from "../../Icons/CloseButton";
import CustomTextInputField from "../../components/CustomTextInputField";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import GoalsCard from "../../components/GoalsCard";
import { status_bar_height } from "../../utils/Dimensions";

const SearchGoals = ({ navigation, route }) => {
  // const navigation = useNavigation();
  const allGoals = route.params;
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (allGoals) {
      return allGoals.filter((item) =>
        item.goalName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }, [allGoals, searchTerm]);

  const closeSearchModal = () => {
    setSearchTerm("");
    navigation.goBack();
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      {/* <View className="absolute right-0 flex-1 h-full w-full bg-screen-bg  "> */}
      <View className="max-h-12 border border-form-text-color flex flex-row items-center justify-between rounded-3xl my-4 px-6 mx-5 ">
        <TextInput
          placeholder="Search by goal name"
          placeholderTextColor={"#B9B9B9"}
          cursorColor={"#B9B9B9"}
          onChangeText={(e) => setSearchTerm(e)}
          value={searchTerm}
          className="w-[70%] flex-1  py-3"
          //   onSubmitEditing={handleSubmitSearchTerm}
        />

        <TouchableOpacity
          className="w-6 h-6 flex items-center justify-center rounded-full  border border-[#000] "
          onPress={closeSearchModal}
        >
          <CloseButton color={"#000"} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchTerm ? filteredData : []}
        renderItem={({ item, index }) => (
          <GoalsCard
            item={item}
            index={index}
            // refetch={refetch}
            lastIndex={searchTerm ? filteredData.length - 1 : 0}
          />
        )}
        className=" flex-1 px-5"
        // ListHeaderComponent={() => <SearchBoxHeader />}
      />
      {/* </View> */}
      {/* <Text className="text-black">Hello world </Text> */}
    </SafeAreaView>
  );
};

export default SearchGoals;
