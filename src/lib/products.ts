import { collection, getDocs, updateDoc,  doc, deleteDoc } from "firebase/firestore";
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

export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, "products", productId);
  await deleteDoc(productRef);
}

export async function updateProduct(
  editingId: string,
  editedProduct: Partial<Product>
): Promise<void> {
  try {
    const productRef = doc(db, "products", editingId); // Make sure you're using the right doc reference

    // Exclude the `id` from the data to prevent it from being updated
    const { ...productData } = editedProduct;

    // Update the document in Firestore
    await updateDoc(productRef, productData);

    console.log("Product updated successfully!");
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product in Firestore");
  }
}
