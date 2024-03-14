import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  type: "",
  amount: 0,
  transactions: [],
};
const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.type = action.payload.type;
      state.amount = action.payload.amount;
      state.transactions = action.payload.transactions;
    },

    reset(state) {
      state.id = "";
      state.name = "";
      state.type = "";
      state.amount = 0;
      state.transactions = [];
    },
  },
});
export default userSlice;
export const userAction = userSlice.actions;
