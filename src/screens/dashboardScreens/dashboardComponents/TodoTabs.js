import { Pressable, View } from "react-native";
import { toggleData } from "../../../utils/dummyData";
import CustomTextRegular from "../../../components/CustomTextRegular";
import PendingTodoComponent from "../../../components/PendingTodoComponent";
import { useState } from "react";
import CompletedTodoComponent from "../../../components/CompletedTodoComponent";

const TodoTabs = ({
  pendingTodoData,
  completedTodoData,
  filterPriority,
  loadingTodos,
  toggleSearchModal,
  handleToggleSearchModal,
  refetch,
}) => {
  const [active, setActive] = useState(0);

  const handleToggleActive = (index) => {
    setActive(index);
  };

  return (
    <View>
      {/* tabs */}
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
                (item) => item.setPirority === filterPriority
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
                (item) => item.setPirority === filterPriority
              )) ||
            completedTodoData
          }
          loading={loadingTodos}
          refetch={refetch}
        />
      )}
    </View>
  );
};

export default TodoTabs;
