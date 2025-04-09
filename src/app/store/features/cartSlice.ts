// redux/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { CartItem, CartState } from "@/types/cart";

import { RootState } from "../store"; // Ensure you import RootState type
import {
  doc,
  where,
  query,
  collection,
  getDocs,
  updateDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getUserDocumentByUID } from "@/lib/utils";
export interface CartStateDataType {
  items: CartItem[];
  totalQuantity: number;
  loading: boolean;
  totalPrice: number;
}

const initialState: CartStateDataType = {
  items: [],
  totalQuantity: 0,
  loading: false,
  totalPrice: 0,
};
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async ({ uid, item }: { uid: string; item: { id: string } }) => {
    try {
      // Fetch full user details from Firestore
      const user = await getUserDocumentByUID(uid);
      if (!user) {
        return [];
      }

      console.log("user data in addItemToCart: ", user);

      const productQuery = query(
        collection(db, "products"),
        where("id", "==", item?.id)
      );

      const productSnap = await getDocs(productQuery);

      if (productSnap.empty) {
        throw new Error(`Product not found: ${item?.id}`);
      }

      let productData:
        | { name: string; price: number; imageUrl: string }
        | undefined;
      productSnap.forEach((doc) => {
        productData = doc.data() as {
          name: string;
          price: number;
          imageUrl: string;
        }; // gets the first matching doc
      });

      console.log("Product found:", productData);

      const cartNewData = {
        name:
          productData?.name ??
          (() => {
            throw new Error("Product data is undefined");
          })(),
        price: productData.price,
        quantity: 1,
        imageUrl: productData.imageUrl,
        productId: item.id,
      };

      // Check for active cart
      const cartRef = collection(db, "cart");
      const cartQuery = query(
        cartRef,
        where("user.id", "==", user?.id),
        where("status", "==", "active")
      );
      const cartSnapshot = await getDocs(cartQuery);
      console.log("cartSnapshot: ", cartSnapshot);
      if (!cartSnapshot.empty) {
        console.log(
          "seems the logged in user already has this item in cart, adding plus product first"
        );
        const cartDoc = cartSnapshot.docs[0];
        const cartId = cartDoc.id;
        const cartDataRef = doc(db, "cart", cartId);
        const cartData = cartDoc.data();

        const cartItems = Array.isArray(cartData.items) ? cartData.items : [];
        const existingItemIndex = cartItems.findIndex(
          (cartItem) => cartItem.productId === item.id
        );

        let updatedItems;
        if (existingItemIndex !== -1) {
          updatedItems = cartItems.map((cartItem) =>
            cartItem.productId === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        } else {
          updatedItems = [...cartItems, cartNewData];
        }

        const totalPrice = updatedItems.reduce(
          (acc, cartItem) => acc + cartItem.price * cartItem.quantity,
          0
        );

        await updateDoc(cartDataRef, {
          items: updatedItems,
          totalPrice,
          updatedAt: Timestamp.now(),
        });

        return updatedItems;
      } else {
        // No active cart, create a new one
        console.log(
          "seems the logged in user doesn't have this in cart, adding the product first"
        );
        const newCart = {
          items: [cartNewData],
          status: "active",
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          totalPrice: productData.price,
          user, // ✅ Store full user details here
        };

        await addDoc(cartRef, newCart);
        return [newCart];
      }
    } catch (error) {
      console.error("Error saving cart:", error);
      throw error;
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ userId, item }: { userId: string; item: { id: string } }) => {
    const cartRef = collection(db, "cart");
    const q = query(
      cartRef,
      where("user.id", "==", userId),
      where("status", "==", "active")
    );
    const cartSnap = await getDocs(q);

    if (!cartSnap.empty) {
      const cartDoc = cartSnap.docs[0];
      const cartId = cartDoc.id;
      const cartDataRef = doc(db, "cart", cartId);

      const cartData = cartDoc.data() as CartState;
      console.log("cart found: ", cartData);

      // Reduce quantity or remove item if quantity reaches 0
      const updatedItems = cartData.items
        .map((cartitem: CartItem) =>
          cartitem.productId === item.id
            ? { ...cartitem, quantity: cartitem.quantity - 1 }
            : cartitem
        )
        .filter((item: CartItem) => item.quantity > 0);

      // Recalculate totals
      const totalQuantity = updatedItems.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      const totalPrice = updatedItems.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
      );

      // Update Firestore
      await updateDoc(cartDataRef, {
        items: updatedItems,
        totalPrice,
        totalQuantity,
        updatedAt: new Date(),
      });

      return updatedItems;
    } else {
      console.log("cartItem not found");
    }
  }
);
export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId: string) => {
    try {
      const cartRef = collection(db, "cart");
      const q = query(
        cartRef,
        where("user.id", "==", userId),
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
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
    addItem: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      console.log(existingItemIndex);
    },
    updateCartState: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
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
        state.items = action.payload || [];
        state.totalQuantity = (action.payload ?? []).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        console.error("Error fetching cart:", action.error.message);
        state.loading = false;
      })
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.totalQuantity = action.payload.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        state.loading = false;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        console.error("Error adding item:", action.error.message);
        state.loading = false;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
        state.totalQuantity = (action.payload ?? []).reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      })
      .addCase(removeCartItem.rejected, (state) => {
        state.loading = false;
      });
  },
});

// ✅ Export the reducer correctly
export const { setCart, removeItem, updateCartState, addItem } =
  cartSlice.actions;

export default cartSlice.reducer; // <-- This is the key export

// Selector to compute totalCount dynamically
export const selectTotalCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
