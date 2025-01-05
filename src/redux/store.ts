import { configureStore } from '@reduxjs/toolkit';

// slices
import foodStoresSlice from '@/redux/slices/foodStoreSlice';
import cuisineSlice from '@/redux/slices/cuisineSlice';
import selectedRestaurantIDSlice from '@/redux/slices/selectedRestaurantIDSlice';
import cartSlice from '@/redux/slices/cartSlice';
import userSlice from '@/redux/slices/userSlice';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    foodStores: foodStoresSlice,
    cuisine: cuisineSlice,
    selectedRestaurantID: selectedRestaurantIDSlice,
    cart: cartSlice,
    user: userSlice,
  }
});

export default store;
