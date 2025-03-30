import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  getDocs,
  collection,
  query,
  where,
  Query,
  DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { CartState } from "@/types/cart";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFilteredCartStates(
  status?: string
): Promise<CartState[]> {
  let q: Query<DocumentData> = collection(db, "cart");

  if (status) {
    q = query(q, where("status", "==", status));
  }

  const querySnapshot = await getDocs(q);
  console.log("querySnapShots: ", querySnapshot);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<CartState, "id">; // Ensure data matches CartState except for 'id'
    return {
      id: doc.id,
      ...data,
    };
  });
}
