import { configureStore } from "@reduxjs/toolkit";

// slices
import cartSlice from "@/redux/slices/cartSlice";
import cuisineSlice from "@/redux/slices/cuisineSlice";
import foodStoresSlice from "@/redux/slices/foodStoreSlice";
import selectedRestaurantIDSlice from "@/redux/slices/selectedRestaurantIDSlice";
import userSlice from "@/redux/slices/userSlice";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    foodStores: foodStoresSlice, // TODO: remove foodStores slice
    cuisine: cuisineSlice, // TODO: remove cuisine slice
    selectedRestaurantID: selectedRestaurantIDSlice, // TODO: remove selectedRestaurantID slice
    cart: cartSlice, // TODO: remove cart slice
    user: userSlice,
    // basket: basketSlice, // TODO: implement basket slice
  },
});

export default store;
