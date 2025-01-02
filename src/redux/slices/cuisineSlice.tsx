import { STORE_CATEGORIES } from "@/data/store-categories";
import { createSlice } from "@reduxjs/toolkit";

// reducer
const cuisineSlice = createSlice({
  name: "cuisineImages",
  initialState: STORE_CATEGORIES,
  reducers: {},
});

export default cuisineSlice.reducer;
// export const { } = cuisineSlice.actions;
