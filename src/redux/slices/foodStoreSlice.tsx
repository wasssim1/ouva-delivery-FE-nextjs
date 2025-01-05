import { createSlice } from "@reduxjs/toolkit";

// data

interface FoodStoresState {}

const initialState: FoodStoresState = {};

const foodStoresSlice = createSlice({
  name: "foodStores",
  initialState,
  reducers: {},
});

export default foodStoresSlice.reducer;
// export const { } = ristorantiSlice.actions;
