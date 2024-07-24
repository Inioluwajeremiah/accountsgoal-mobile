import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = {
  events: [],
};
const eventSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {
    addEvent: (state, action) => {
      const item = action.payload;
      state.events = [...state.events, item];
    },
    editEvent: (state, action) => {
      const editedEvent = action.payload;
      state.events = state.events.map((event) =>
        event._id === editedEvent._id ? editedEvent : event
      );
    },
    deleteEvent: (state, action) => {
      const itemId = action.payload;
      state.events = state.events.filter((item) => item._id !== itemId);
    },
    clearEvents: (state) => (state = initialState),
  },
});

export const { addEvent, deleteEvent, clearEvents } = eventSlice.actions;
export default eventSlice.reducer;
