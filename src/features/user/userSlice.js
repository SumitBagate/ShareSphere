// src/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  credits: 0,
  isAdmin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setCredits: (state, action) => {
      state.credits = action.payload;
    },
    setIsAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
      state.credits = 0;
      state.isAdmin = false;
    },
  },
});

export const { setUser, setCredits, setIsAdmin, resetUser } = userSlice.actions;
export default userSlice.reducer;
