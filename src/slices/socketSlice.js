import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  activeUsers: [],
};

const socketSlice = createSlice({
  name: "socketio",
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setActiveUsers: (state, action) => {
      const user = action.payload;
      const existingUser = state.activeUsers.some(
        (item) => item._id === user._id
      );
      if (!existingUser) {
        state.activeUsers = [...state.activeUsers, user];
      }
      // if (existingUser) {
      //   state.activeUsers = state.activeUsers.map((item) =>
      //     item._id === existingUser._id ? user : item
      //   );
      // } else {
      //   state.activeUsers = [...state.activeUsers, item];
      // }

      // return updateCart(state);
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item._id !== itemId);

      return updateCart(state);
    },
  },
});

export const { setSocket, setActiveUsers } = socketSlice.actions;

export default socketSlice.reducer;
