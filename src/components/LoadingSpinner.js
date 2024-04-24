import { View, ActivityIndicator } from "react-native";

const LoadingSpinner = () => {
  return (
    <View className="flex-1 w-full flex justify-center items-center">
      <ActivityIndicator size="small" color="#4169E1" />
    </View>
  );
};

export default LoadingSpinner;
