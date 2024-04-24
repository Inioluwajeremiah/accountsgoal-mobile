import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accountsGoalUser: null,
  accountsGoalOrganisation: null,
  onboarding: false,
  userId: "",
  importFile: false,
};

const acgUserSlice = createSlice({
  name: "acgUser",
  initialState,
  reducers: {
    setAcgUserData: (state, action) => {
      state.accountsGoalUser = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setAcgUserOnboarding: (state, action) => {
      state.onboarding = action.payload;
    },
    setAcgOrganisationData: (state, action) => {
      state.accountsGoalOrganisation = action.payload;
    },
    setImportFile: (state, action) => {
      state.importFile = action.payload;
    },
    clearAcgUserData: (state, action) => {
      state.accountsGoalUser = null;
      state.accountsGoalOrganisation = null;
    },
  },
});

export const {
  setAcgUserData,
  setAcgOrganisationData,
  setUserId,
  setAcgUserOnboarding,
  setImportFile,
  clearAcgUserData,
} = acgUserSlice.actions;

export default acgUserSlice.reducer;
