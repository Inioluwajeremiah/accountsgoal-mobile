import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "@react-native-async-storage/async-storage";
import onbardingSliceReducer from "./src/slices/onbardingSlice";

const persistConfig = {
  key: "user_data",
  storage,
};

const persistedOnboardingReducer = persistReducer(
  persistConfig,
  onbardingSliceReducer
);

const store = configureStore({
  reducer: {
    onboarding: persistedOnboardingReducer,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // .concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export default store;
