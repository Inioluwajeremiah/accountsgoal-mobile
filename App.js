import MainScreen from "./src/screens/MainScreen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MainScreen />
      </PersistGate>
    </Provider>
  );
}
