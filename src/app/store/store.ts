import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";
import notificationReducer from "./features/notificationSlice";
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    cart: cartReducer,
    notification: notificationReducer, // ✅ Add the notification slice
  },
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
