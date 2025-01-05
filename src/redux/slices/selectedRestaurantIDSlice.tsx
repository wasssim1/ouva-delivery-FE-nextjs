import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

// selector that takes the selected id and returns the corresponding restaurant object
export const selectSelectedRestaurant =
  (idSelected: string) => (state: RootState) => {
    const foodStores = state.foodStores;
    const allFoodStores = Object.values(foodStores).flat();

    const selectedFoodStore = allFoodStores.find(
      (store) => store.id === idSelected
    );

    if (selectedFoodStore) {
      return selectedFoodStore;
    } else {
      window.location.href = "/orders";
      return null;
    }
  };

const selectedRestaurantIDSlice = createSlice({
  name: "selectedRestaurant",
  initialState: null,
  reducers: {
    setSelectedRestaurant: (_state, action) => {
      return action.payload;
    },
  },
});

export default selectedRestaurantIDSlice.reducer;
export const { setSelectedRestaurant } = selectedRestaurantIDSlice.actions;
