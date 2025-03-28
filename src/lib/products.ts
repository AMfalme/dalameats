import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import { Product } from "@/types/products";
export async function getProducts(): Promise<Product[]> {
  const querySnapshot = await getDocs(collection(db, "products"));

  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Product, "id">; // ✅ Ensure id is not in spread data

    return {
      id: doc.id, // ✅ Explicitly set id
      ...data, // ✅ Spread the rest of the product data
    };
  });
}
