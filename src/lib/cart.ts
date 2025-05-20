import { db } from "./firebase/config";
import { CartItem, CartState } from "@/types/cart";

import {} from "@/types/cart";
import {
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  QueryConstraint,
  // DocumentData,
  doc,
  getDoc,
  updateDoc,
  // Timestamp,
} from "firebase/firestore";
export async function deleteCart(cartId: string): Promise<void> {
  const cartRef = doc(db, "cart", cartId);
  await deleteDoc(cartRef);
}

export async function updateCartStatus(orderId: string, status: string) {
  try {
    const orderRef = doc(db, "cart", orderId);
    await updateDoc(orderRef, { status });
  } catch (error) {
    console.log(error);
  }
}

export async function fetchFilteredCartStates(
  status?: string,
  startDate?: string // ISO timestamp
): Promise<CartState[]> {
  const constraints: QueryConstraint[] = [];

  if (status) {
    constraints.push(where("status", "==", status));
  }

  if (startDate) {
    constraints.push(where("status", "==", "sale")); // required if filtering by soldAt
    constraints.push(where("soldAt", ">=", new Date(startDate)));
  }

  const q = query(collection(db, "cart"), ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<CartState, "id">;
    return {
      id: doc.id,
      ...data,
    };
  });
}
