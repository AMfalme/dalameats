import { updateDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import {CartItem } from "@/types/cart"
import { doc, deleteDoc } from "firebase/firestore";

export async function deleteCart(cartId: string): Promise<void> {
  const cartRef = doc(db, "cart", cartId);
  await deleteDoc(cartRef);
}


export async function updateCart(
    editingId: string,
    editedCart: Partial<CartItem>
  ): Promise<void> {
    try {
      const cartRef = doc(db, "cart", editingId); // Make sure you're using the right doc reference
  
      // Exclude the `id` from the data to prevent it from being updated
      const { ...cartData } = editedCart;
  
      // Update the document in Firestore
      await updateDoc(cartRef, cartData);
  
      console.log("Cart updated successfully!");
    } catch (error) {
      console.error("Error updating cart:", error);
      throw new Error("Error updating cart in Firestore");
    }
  }