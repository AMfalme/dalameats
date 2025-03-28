// redux/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { CartItem } from "@/types/cart";
import {
  doc,
  getDoc,
  where,
  query,
  collection,
  getDocs,
  updateDoc,
  Timestamp,
  addDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types/products";

const initialState: {
  items: CartItem[];
  totalQuantity: number;
  loading: boolean;
  totalPrice: number;
} = {
  items: [],
  totalQuantity: 0,
  loading: false,
  totalPrice: 0,
};

// Async thunk to fetch product details and add to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ userId, item }: { userId: string; item: Product }, { dispatch }) => {
    try {
      const productRef = doc(db, "products", item?.id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error(`Product not found: ${item.id}`);
      }
      const productData = productSnap.data();
      const cartNewData = {
        name: productData.name,
        price: productData.price,
        quantity: 1,
        imageUrl: productData.imageUrl,
        productId: item.id,
      };

      // Check for active cart
      const cartRef = collection(db, "cart");
      const q = query(
        cartRef,
        where("userId", "==", userId),
        where("status", "==", "active")
      );
      const cartSnapshot = await getDocs(q);
      let cartData: DocumentData = { items: [] }; // Initialize with default structure
      // console.log("cartSnapshot: ", cartSnapshot);
      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0]; // Return the active cart

        const cartId = cartDoc.id;
        const cartDataRef = doc(db, "cart", cartId);
        cartData = cartDoc.data();

        // ✅ Ensure `cartData.items` is always an array
        const cartItems: CartItem[] = Array.isArray(cartData.items)
          ? cartData.items
          : [];
        // ✅ Find existing item

        const existingItemIndex = cartItems.findIndex(
          (product: CartItem) => product.productId === item.id
        );
        // if an item exists, just update quantity and totalPrice
        console.log("existingItemIndex: ", existingItemIndex);
        let updatedItems;
        if (existingItemIndex !== -1) {
          updatedItems = cartData.items.map((cartItem: CartItem) => {
            console.log("cartItem: ", cartItem);
            return cartItem.productId === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 } // ✅ Now updates the correct item
              : cartItem;
          });

          // console.log("Cart item quantity updated");
        } else {
          updatedItems = [...cartData.items, cartNewData]; // ✅ Append new item
        }
        // update
        const totalPrice = updatedItems.reduce(
          (acc: number, cartItem: CartItem) =>
            acc + cartItem.price * cartItem.quantity,
          0
        );
        await updateDoc(cartDataRef, {
          items: updatedItems,
          totalPrice: totalPrice,
          updatedAt: Timestamp.now(),
        });
        return updatedItems;
      } else {
        // console.log("No active cart found for this user");

        const newCart = {
          items: [
            {
              name: productData.name,
              price: productData.price,
              imageUrl: productData.imageUrl,
              quantity: 1,
              productId: item.id,
            },
          ],
          status: "active",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          totalPrice: productData.price,
          userId,
        };
        // console.log("newCart: ", newCart);
        await addDoc(cartRef, newCart);
        return [newCart];
        // console.log("New cart created and item added");
      }
    } catch (error) {
      console.error("Error saving cart:", error);
    }

    // return updatedItems; // Return updated cart for Redux state
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId: string) => {
    try {
      const cartRef = collection(db, "cart");
      const q = query(
        cartRef,
        where("userId", "==", userId),
        where("status", "==", "active")
      );
      const cartSnapshot = await getDocs(q);

      if (!cartSnapshot.empty) {
        const cartData = cartSnapshot.docs[0].data();
        return Array.isArray(cartData.items) ? cartData.items : [];
      }
      return []; // Return empty cart if no active cart exists
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    updateCart: (state, action) => {
      state.items = action.payload;
      state.totalQuantity = action.payload.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        console.error("Error fetching cart:", action.error.message);
        state.loading = false;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
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
