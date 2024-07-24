import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useRef } from "react";
import Swipeable from "react-native-gesture-handler/Swipeable";
import PlayIcon from "../Icons/PlayIcon";
import CustomTextRegular from "./CustomTextRegular";
import { windowWidth } from "../utils/Dimensions";
import AudioIcon from "../Icons/AudioIcon";
import WebView from "react-native-webview";
// import WebView from "react-native-webview";

const SwipeableNoteCard = ({ renderRightActions, index, item }) => {
  const imageHeight = Math.floor(windowWidth * 0.8);
  const webViewRef = useRef(null);

  const waveform = (audioUrl) => {
    return (htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wavesurfer</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
        }
        #waveform {
          width: 100%;
          height: 200px; /* Adjust height as needed */
          background-color: #fff;
        }
      </style>
      <script src="https://unpkg.com/wavesurfer.js"></script>
    </head>
    <body>
      <div id="waveform"></div>
      <script>
        var wavesurfer = WaveSurfer.create({
          container: '#waveform',
          waveColor: 'violet',
          progressColor: 'purple'
        });
        wavesurfer.load("${audioUrl}");
      </script>
    </body>
    </html>
    
  `);
  };
  return (
    <View
      key={index}
      className="flex flex-row items-center justify-between"
      renderRightActions={() =>
        renderRightActions(
          item.audioUrl ? "audio" : item.imageUrl ? "image" : "text"
        )
      }
    >
      {item?.textName && (
        <CustomTextRegular className="text-primary-accent-color my-4">
          {item?.textName}
        </CustomTextRegular>
      )}
      {item.audioUrl && (
        <View className="w-[80%] flex flex-row justify-evenly items-center my-4 ">
          <TouchableOpacity
            className="w-8 h-8 rounded-full bg-primary-color flex justify-center items-center mr-4"
            onPress={() => playSound(item.audioUrl)}
          >
            <PlayIcon color={"#fff"} />
          </TouchableOpacity>

          <WebView
            className="bg-screen-bg mr-4"
            ref={webViewRef}
            originWhitelist={["*"]}
            source={{ html: waveform(item.audioUrl) }}
          />
          <AudioIcon />
        </View>
      )}
      {item?.imageUrl && (
        <Image
          source={{ uri: item?.imageUrl }}
          style={{ width: imageHeight, height: imageHeight }}
          className="my-4 bg-black  object-contain rounded-3xl "
        />
      )}
    </View>
  );
};

export default SwipeableNoteCard;
