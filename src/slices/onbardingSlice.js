import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onboardingData: null,
};

const onbardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setOnboardingData: (state, action) => {
      state.onboardingData = action.payload;
    },
    clearOnboardingData: (state, action) => {
      state.onboardingData = null;
    },
  },
});

export const { setOnboardingData, clearOnboardingData } =
  onbardingSlice.actions;

export default onbardingSlice.reducer;
