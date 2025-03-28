// redux/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { CartItem, CartState } from "@/types/cart";
import {
  doc,
  getDoc,
  setDoc,
  where,
  query,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  Timestamp,
  addDoc,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Product } from "@/types/products";
import { CardHeader } from "@/components/ui/card";

const initialState: { items: CartItem[]; loading: boolean } = {
  items: [],
  loading: false,
};

// Async thunk to fetch product details and add to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ userId, item }: { userId: string; item: Product }, { getState }) => {
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

      // Check if user already has an active cart
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
        console.log("cartData: ", cartData);
        console.log("productData: ", productData);

        // if active cart exists, check if product is already in cart.
        // Check if item is already in cart
        console.log(productData.id);
        const existingItemIndex = cartData.items.findIndex(
          (product: CartItem) => product.productId === item.id
        );
        // if an item exists, just update quantity and totalPrice
        console.log("existingItemIndex: ", existingItemIndex);
        if (existingItemIndex !== -1) {
          console.log("Item already in cart, updating quantity: ", cartData);
          console.log("cartData.items: ", cartData.items);
          const updatedItems = cartData.items.map((cartItem: CartItem) => {
            console.log("cartItem: ", cartItem);
            return cartItem.productId === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 } // ✅ Now updates the correct item
              : cartItem;
          });

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

          // console.log("Cart item quantity updated");
        } else {
          console.log("item not in cart");
          // if item does not exist, add it to the cart
          const updatedItems = [...cartData.items, cartNewData]; // ✅ Append new item
          const totalPrice = updatedItems.reduce(
            (acc: number, cartItem: CartItem) =>
              acc + cartItem.price * cartItem.quantity,
            0
          );
          console.log("new cart items: ", updatedItems);
          await updateDoc(cartDataRef, {
            items: updatedItems,
            totalPrice: totalPrice,
            updatedAt: Timestamp.now(),
          });

          // console.log("New cart item added");
        }
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
        // console.log("New cart created and item added");
      }

      // console.log("adding to cart in firestore");

      // await setDoc(cartRef, updatedCartData, { merge: true });

      console.log("Cart saved successfully!");
      return cartSnapshot.empty
        ? [
            {
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
              quantity: 1,
              productId: item.id,
            },
          ]
        : cartData?.items || []; // Safely handle undefined cartData
    } catch (error) {
      console.error("Error saving cart:", error);
    }

    // return updatedItems; // Return updated cart for Redux state
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
