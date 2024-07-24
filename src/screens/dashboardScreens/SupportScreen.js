import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackIcon from "../../Icons/BackIcon";
import CustomTextRegular from "../../components/CustomTextRegular";
import ChatIcon from "../../Icons/ChatIcon";
import { supportData } from "../../utils/dummyData";
import AddIcon from "../../Icons/AddIcon";
import videosupport from "../../../assets/vidsupport.png";

const SupportScreen = ({ navigation }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleToggleItem = (id) => {
    setSelectedItems((prevItem) => {
      if (prevItem.includes(id)) {
        return prevItem.filter((item) => item !== id);
      } else {
        return [...prevItem, id];
      }
    });
  };
  useEffect(() => {
    const handlePress = async (url) => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log(`Don't know how to open this URL: ${url}`);
      }
    };
    handlePress("https://www.accountsgoal.com/#faq");
  }, [navigation]);
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* back icon */}

      <ScrollView
        className="flex-1  px-5 "
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* header */}
        <View className="flex flex-row items-center mt-8">
          <TouchableOpacity
            className=" mr-5"
            onPress={() => navigation.goBack()}
          >
            <BackIcon />
          </TouchableOpacity>

          <CustomTextRegular className="text-2xl font-bold  ">
            Support
          </CustomTextRegular>
        </View>
        <CustomTextRegular className="text-base font-bold leading-7 mt-6 text-black mb-6">
          {"How can we help you?"}
        </CustomTextRegular>

        <View className="flex flex-row items-center justify-between mb-6">
          <CustomTextRegular className="text-base leading-7 text-black ">
            {"Top Questions"}
          </CustomTextRegular>
          <TouchableOpacity>
            <CustomTextRegular className="text-primary-color text-[13px]">
              View all
            </CustomTextRegular>
          </TouchableOpacity>
        </View>

        {/* accordion div */}
        {supportData.map((item, index) => (
          <View
            key={item.id}
            className="bg-[#F8F8F8] px-4 py-2  mb-4 rounded-md"
          >
            <TouchableOpacity
              className="flex flex-row items-center justify-between mb-2 "
              onPress={() => handleToggleItem(item.id)}
            >
              <CustomTextRegular className="text-[12px] w-[90%] leading-6 font-bold">
                {item.title}
              </CustomTextRegular>
              <CustomTextRegular className="ml-2">
                {" "}
                {selectedItems.includes(item.id) ? "-" : "+"}
              </CustomTextRegular>
              {/* <AddIcon color={"#000"} /> */}
            </TouchableOpacity>

            {selectedItems.includes(item.id) &&
              // (item.id === 4 ? (
              //   <Image className="w-full h-full bg-black" />
              // ) : (
              item.value.map((value, key) => (
                <View
                  key={key}
                  className={`${key === item.value.length - 1 && "mb-4"}`}
                >
                  {item.id === 4 && (
                    <Image
                      source={videosupport}
                      className="w-full mt-1 border"
                    />
                  )}
                  <CustomTextRegular className="text-xs py-1">
                    {value}
                  </CustomTextRegular>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>

      {/* chat icon */}
      <TouchableOpacity
        className="absolute right-5 bottom-20 bg-primary-color w-[60px] h-[60px] rounded-full flex items-center justify-center"
        onPress={() => navigation.navigate("Support Chat")}
      >
        <ChatIcon />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SupportScreen;
