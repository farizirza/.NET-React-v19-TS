import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PizzaSize } from "./APIResponsesTypes";

export interface OrderState {
  pizzaType: string;
  pizzaSize: PizzaSize;
}

const initialState: OrderState = {
  pizzaType: "pepperoni",
  pizzaSize: "M",
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setPizzaType(state, action: PayloadAction<string>) {
      state.pizzaType = action.payload;
    },
    setPizzaSize(state, action: PayloadAction<PizzaSize>) {
      state.pizzaSize = action.payload;
    },
  },
  selectors: {
    selectPizzaType: (order) => order.pizzaType,
    selectPizzaSize: (order) => order.pizzaSize,
  },
});

export const { setPizzaType, setPizzaSize } = orderSlice.actions;
export const { selectPizzaType, selectPizzaSize } = orderSlice.selectors;
