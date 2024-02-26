import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accountsGoalUser: null,
  onboarding: false,
};

const acgUserSlice = createSlice({
  name: "acgUser",
  initialState,
  reducers: {
    setAcgUserData: (state, action) => {
      state.accountsGoalUser = action.payload;
    },
    setAcgUserOnboarding: (state, action) => {
      state.onboarding = action.payload;
    },
    clearAcgUserData: (state, action) => {
      state.accountsGoalUser = null;
    },
  },
});

export const { setAcgUserData, setAcgUserOnboarding, clearAcgUserData } =
  acgUserSlice.actions;

export default acgUserSlice.reducer;
