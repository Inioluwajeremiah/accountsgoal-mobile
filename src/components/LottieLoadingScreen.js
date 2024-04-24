import { View, Text, Modal } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const LottieLoadingScreen = ({ loading }) => {
  return (
    <Modal animationType="none" visible={loading} transparent={true}>
      <View className="flex-1 h-full w-full bg-black/30 justify-center items-center">
        <LottieView
          className="w-32 h-32"
          source={require("../../assets/starloader.json")}
          autoPlay
          loop={true}
        />
      </View>
    </Modal>
  );
};

export default LottieLoadingScreen;
