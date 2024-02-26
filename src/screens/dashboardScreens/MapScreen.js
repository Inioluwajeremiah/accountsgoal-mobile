import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import MenuIcon from "../../Icons/MenuIcon";
import FilterIcon from "../../Icons/FilterIcon";
import MapView, { GOOGLE_PROVIDER } from "react-native-maps";
import { windowHeight, windowWidth } from "../../utils/Dimensions";

const MapScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1">
      <MapView
        style={{ width: windowWidth, height: windowHeight }}
        provider={GOOGLE_PROVIDER}
      />

      {/* menu icon and filter */}
      <View className=" absolute top-4 flex flex-row items-center px-5 mt-4 ">
        {/* menu */}
        <TouchableOpacity
          className="h-12 w-12 rounded-full bg-white flex flex-row justify-center items-center  mr-4 "
          onPress={() => navigation.openDrawer()}
        >
          <MenuIcon />
        </TouchableOpacity>

        <View className="w-full flex-1  flex flex-row items-center justify-between bg-white rounded-full  ">
          <TextInput
            placeholder="Search account name"
            className="  p-3 text-sm text-border-color "
            placeholderTextColor={"#A8A8A8"}
            cursorColor={"#A8A8A8"}
          />
          <TouchableOpacity className=" p-3 ">
            <FilterIcon />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MapScreen;
