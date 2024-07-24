import MainScreen from "./src/screens/MainScreen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import { SafeAreaView, View } from "react-native";
import SPlashIconII from "./src/Icons/SPlashIconII";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-primary-color">
      <Provider store={store}>
        <PersistGate
          persistor={persistor}
          loading={
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SPlashIconII />
            </View>
          }
        >
          <GestureHandlerRootView className="flex-1">
            <MainScreen />
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}
