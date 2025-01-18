"use client";

import { BasketState } from "@/interfaces/basket.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartState = BasketState;

const getInitialCartState = (): CartState => {
  if (typeof window !== "undefined") {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return {
    foodStore: {},
    orderItems: [],
  } as unknown as BasketState;
};

const initialState: CartState = getInitialCartState();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // reduxer to add a product to the cart. If the product already exists in the cart, increase its quantity by 1. Otherwise, add the product to the cart with a quantity of 1.
    addToCart(state, action: PayloadAction<BasketState>) {},
    // function to remove a product from the cart. When the quantity of the product in the cart is 0, it will automatically removed from the cart
    removeFromCart(state, action: PayloadAction<BasketState>) {
      // const
    },
    // function to remove all products from the cart
    removeAllFromCart(state) {
      state.basketItems.splice(0, state.basketItems.length);
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, removeAllFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;
