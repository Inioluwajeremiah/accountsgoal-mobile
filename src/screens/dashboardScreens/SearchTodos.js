import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useSearchTodoQuery } from "../../slices/todoApiSlice";
import CloseButton from "../../Icons/CloseButton";
import CustomTextInputField from "../../components/CustomTextInputField";
import PendingTodoCard from "../../components/PendingTodoCard";
import { status_bar_height } from "../../utils/Dimensions";

const SearchTodos = ({ navigation, route }) => {
  const { userTodos, refetch } = route.params;
  const [searchTerm, setSearchTerm] = useState("");

  const searchData = useMemo(() => {
    return (
      userTodos &&
      userTodos.filter((item) =>
        item.todoName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [userTodos, searchTerm]);

  const closeSearchModal = () => {
    setSearchTerm("");
    navigation.goBack();
  };

  // animationType="slide" visible={toggleSearchModal} transparent={true}

  return (
    <SafeAreaView
      className="flex-1"
      style={{ marginTop: Platform.OS === "ios" ? 0 : status_bar_height }}
    >
      {/* <View className="absolute right-0 flex-1 h-full w-full bg-screen-bg "> */}
      {/* search bar */}
      <View className="h-12  border border-form-text-color flex flex-row items-center justify-between rounded-3xl my-4 px-6 mx-5 ">
        <CustomTextInputField
          placeholder="Search by Todo name"
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
        data={searchTerm ? searchData : []}
        renderItem={({ item }) => (
          <PendingTodoCard item={item} refetch={refetch} />
        )}
        className=" flex-1 px-5"
        // ListHeaderComponent={() => <SearchBoxHeader />}
      />
      {/* </View> */}
    </SafeAreaView>
  );
};

export default SearchTodos;
