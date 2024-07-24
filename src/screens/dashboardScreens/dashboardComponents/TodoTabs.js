import { Pressable, View } from "react-native";
import { toggleData } from "../../../utils/dummyData";
import CustomTextRegular from "../../../components/CustomTextRegular";
import PendingTodoComponent from "../../../components/PendingTodoComponent";
import { useState } from "react";
import CompletedTodoComponent from "../../../components/CompletedTodoComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NoTodoIcon from "../../../Icons/NoTodoIcon";

const TodoTabs = ({
  pendingTodoData,
  completedTodoData,
  filterPriority,
  loadingTodos,
  toggleSearchModal,
  handleToggleSearchModal,
  refetch,
  ModalHeaderComponent,
}) => {
  const [active, setActive] = useState(0);

  const handleToggleActive = (index) => {
    setActive(index);
  };

  return (
    <GestureHandlerRootView className="flex-1">
      {ModalHeaderComponent && <ModalHeaderComponent />}

      {(pendingTodoData?.length === 0 || !completedTodoData?.length === 0) && (
        <View className="flex-1 items-center justify-center">
          <NoTodoIcon />
          <CustomTextRegular className="font-black text-lg text-black mt-4">
            No To-do set
          </CustomTextRegular>
        </View>
      )}
      {/* tabs */}
      {(pendingTodoData?.length > 0 || completedTodoData?.length > 0) && (
        <>
          <View className="px-5 flex flex-row justify-between pt-4 bg-white">
            {toggleData.map((item, index) => (
              <Pressable
                key={index}
                className="w-1/2 py-2"
                style={{
                  borderBottomWidth: active === index ? 4 : 0,
                  borderBottomColor: active === index ? "#4169E1" : "",
                }}
                onPress={() => handleToggleActive(index)}
              >
                <CustomTextRegular className="text-center ">
                  {item.title}
                </CustomTextRegular>
              </Pressable>
            ))}
          </View>
          {/* flatlist */}
          {active === 0 && (
            <PendingTodoComponent
              pendingTodoData={
                (filterPriority &&
                  pendingTodoData.filter(
                    (item) => item.setPriority === filterPriority
                  )) ||
                pendingTodoData
              }
              loading={loadingTodos}
              toggleSearchModal={toggleSearchModal}
              handleToggleSearchModal={handleToggleSearchModal}
              refetch={refetch}
            />
          )}
          {active === 1 && (
            <CompletedTodoComponent
              completedTodoData={
                (filterPriority &&
                  completedTodoData.filter(
                    (item) => item.setPriority === filterPriority
                  )) ||
                completedTodoData
              }
              loading={loadingTodos}
              refetch={refetch}
            />
          )}
        </>
      )}
    </GestureHandlerRootView>
  );
};

export default TodoTabs;
