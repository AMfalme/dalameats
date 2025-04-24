import { db } from "@/lib/firebase/config";
import { CartItem } from "@/types/cart";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";

export const handleUpdateCartQuantity = async (item: CartItem) => {
  try {
    const cartRef = doc(db, "cart", item.id); // make sure CartItem has `cartId`
    const cartDoc = await getDoc(cartRef);
    const data = cartDoc.data();

    const updatedItems = data.items.map((i: CartItem) =>
      i.productId === item.productId ? { ...i, quantity: item.quantity } : i
    );

    const totalPrice = updatedItems.reduce(
      (acc: number, i: CartItem) => acc + i.price * i.quantity,
      0
    );

    await updateDoc(cartRef, {
      items: updatedItems,
      totalPrice,
      updatedAt: Timestamp.now(),
    });
  } catch (err) {
    console.error("Error updating cart quantity:", err);
  }
};
