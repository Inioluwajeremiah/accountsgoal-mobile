import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useMemo, useState } from "react";
import { useSearchTodoQuery } from "../../slices/todoApiSlice";
import CloseButton from "../../Icons/CloseButton";
import CustomTextInputField from "../../components/CustomTextInputField";
import PendingTodoCard from "../../components/PendingTodoCardOld";

const SearchTodos = ({ navigation, route }) => {
  const userTodos = route.params;
  const [searchTerm, setSearchTerm] = useState("");

  console.log("userTodos ==> ", userTodos);

  const searchData = useMemo(() => {
    return (
      userTodos &&
      userTodos.todos.filter((item) =>
        item.eventName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [userTodos, searchTerm]);

  const closeSearchModal = () => {
    setSearchTerm("");
    navigation.goBack();
  };

  console.log("searchData  ===> ", searchData);
  // animationType="slide" visible={toggleSearchModal} transparent={true}

  return (
    <SafeAreaView className="flex-1">
      <View className="absolute right-0x flex-1 h-full w-full bg-screen-bg  ">
        <View className="max-h-12 border border-form-text-color flex flex-row items-center justify-between rounded-3xl my-4 px-6 mx-5 ">
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
          renderItem={({ item }) => <PendingTodoCard item={item} />}
          className=" flex-1 px-5"
          // ListHeaderComponent={() => <SearchBoxHeader />}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchTodos;
