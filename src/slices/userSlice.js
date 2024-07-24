import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accountsGoalUser: null,
  accountsGoalOrganisation: null,
  onboarding: false,
  userId: "",
  organisationId: "",
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
    setOrganizationId: (state, action) => {
      state.organisationId = action.payload;
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
      state.userId = "";
      state.organisationId = "";
    },
  },
});

export const {
  setAcgUserData,
  setAcgOrganisationData,
  setUserId,
  setOrganizationId,
  setAcgUserOnboarding,
  setImportFile,
  clearAcgUserData,
} = acgUserSlice.actions;

export default acgUserSlice.reducer;
