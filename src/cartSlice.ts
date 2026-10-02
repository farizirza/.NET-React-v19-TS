import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Pizza, PizzaSize } from "./APIResponsesTypes";

export interface CartItem {
  pizza: Pizza;
  size: PizzaSize;
  price: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.items.push(action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
  selectors: {
    selectCartItems: (cart) => cart.items,
    selectCartCount: (cart) => cart.items.length,
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export const { selectCartItems, selectCartCount } = cartSlice.selectors;