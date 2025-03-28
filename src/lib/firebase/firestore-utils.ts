import { db } from "./config"; // Firestore instance
import { CartItem } from "@/types/cart";
import data from "@/app/catalogue/data.json";
import { doc, getDocs, collection, query, where } from "firebase/firestore";

const loadCartFromFirestore = async (userId: string, dispatch: any) => {
  if (!userId) return null;

  try {
    const cartRef = collection(db, "cart");
    const q = query(
      cartRef,
      where("userId", "==", userId),
      where("status", "==", "active")
    );

    const cartSnap = await getDocs(q);

    if (!cartSnap.empty) {
      const cartData = cartSnap.docs[0];
      dispatch(setCart(cartData)); // ✅ Update Redux
      return cartData;
    }
  } catch (error) {
    console.error("Error loading cart:", error);
  }
  return null;
};

const uploadProducts = async (products: CartItem[], userId: string) => {
  const response = await fetch("/api/add-products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: products, userId }),
  });
  const data = await response.json();
  console.log(data);
};
export { loadCartFromFirestore };
