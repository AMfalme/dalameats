// redux/slices/cartSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string[];
  quantity: number;
}

const initialState: { items: CartItem[] } = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

// ✅ Export the reducer correctly
export const { addItem, removeItem } = cartSlice.actions;
export default cartSlice.reducer; // <-- This is the key export
