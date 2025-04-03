// redux/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { CartItem, CartState } from "@/types/cart";

import { RootState } from "../store"; // Ensure you import RootState type
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
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getUserDocumentByUID } from "@/lib/utils";
export interface CartStateDataType {
  items: CartItem[];
  totalQuantity: number;
  loading: boolean;
  totalPrice: number;
}

// Async thunk to fetch product details and add to cart
const loadCartFromLocalStorage = (): CartItem[] => {
  const cartData = localStorage.getItem("cart");
  return cartData ? JSON.parse(cartData) : [];
};
const initialState: CartStateDataType = {
  items: loadCartFromLocalStorage(),
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
        where("user.id", "==", user?.id),
        where("status", "==", "active")
      );
      const cartSnapshot = await getDocs(q);

      if (!cartSnapshot.empty) {
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
      console.log("before :  ", state.items);
      state.items = action.payload;

      console.log("after: ", state.items);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
    addItem: (state, action) => {
      console.log("before :  ", state.items);

      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex !== -1) {
        // Create a new array to ensure reactivity
        state.items = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
      console.log("after: ", state.items);
    },
    updateCartState: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      state.totalQuantity = action.payload.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );
      // Object.assign(state, action.payload);
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
