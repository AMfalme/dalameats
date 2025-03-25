// redux/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { CartItem } from "@/types/cart";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const initialState: { items: CartItem[]; loading: boolean } = {
  items: [],
  loading: false,
};

// Async thunk to fetch product details and add to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (
    { userId, item }: { userId: string; item: CartItem },
    { getState }
  ) => {
    console.log("adding to cart step one call");
    const productRef = doc(db, "products", item.id);
    console.log("adding to cart step two call");
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error(`Product not found: ${item.id}`);
    }
    console.log("product found");
    const productData = productSnap.data();
    const newItem: CartItem = {
      id: item.id,
      name: productData.name,
      price: productData.price,
      imageUrl: productData.imageUrl,
      quantity: 1,
    };

    // Get current cart state
    const state = getState() as { cart: { items: CartItem[] } };
    const existingItem = state.cart.items.find(
      (product) => product.id === item.id
    );

    // Update cart items
    const updatedItems = existingItem
      ? state.cart.items.map((product) =>
          product.id === item.id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      : [...state.cart.items, newItem];

    // Save to Firestore
    const cartData = {
      userId,
      items: updatedItems,
      totalPrice: updatedItems.reduce(
        (acc, p) => acc + p.quantity * p.price,
        0
      ),
      updatedAt: new Date(),
    };
    console.log("adding to cart in firestore");
    try {
      console.log("cartData: ", cartData);
      const cartRef = doc(db, "cart", userId);
      await setDoc(cartRef, cartData, { merge: true });

      console.log("Cart saved successfully!");
    } catch (error) {
      console.error("Error saving cart:", error);
    }

    return updatedItems; // Return updated cart for Redux state
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        console.error("Error adding item:", action.error.message);
        state.loading = false;
      });
  },
});

// ✅ Export the reducer correctly
export const { removeItem } = cartSlice.actions;
export default cartSlice.reducer; // <-- This is the key export
