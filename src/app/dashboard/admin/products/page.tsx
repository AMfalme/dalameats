"use client";

import Image from "next/image";
import { getProducts, updateProduct, deleteProduct } from "@/lib/products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import { ChangeEvent, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/components/providers/auth-provider"; // adjust if different
import { getUserDocumentByUID } from "@/lib/utils";

// Replace with your authentication logic to get the current user's role
const getCurrentUserRole = () => {
  // This is a placeholder. Replace with actual role fetching logic.
  return "admin"; // Possible values: "admin", "customer", "rider"
};

export default function AdminProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const userRole = getCurrentUserRole(); // Fetch the current user's role
  const user = useAuth();
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user?.uid) {
        const userDoc = await getUserDocumentByUID(user.uid);
        setIsAdmin(userDoc?.role === "admin");
      }
    };
    fetchUserRole();
  }, [user]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = async () => {
    if (editingId) {
      try {
        setIsLoading(true); // Show loading indicator
        const currentProduct = products.find((p) => p.id === editingId);
        if (currentProduct) {
          await updateProduct(editingId, editedProduct);
          setProducts((prev) =>
            prev.map((p) =>
              p.id === editingId ? { ...p, ...editedProduct } : p
            )
          );
          setEditingId(null);
        }
      } catch (error) {
        console.error("Error saving product:", error);
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id); // Call deleteProduct to delete the product
      setProducts((prev) => prev.filter((product) => product.id !== id)); // Remove the deleted product from state
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleChange = (
    _e: ChangeEvent<HTMLInputElement>,
    field: keyof Product,
    value: string | number
  ) => {
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };

  function handleCheckboxChange(arg: string): void {
    console.log(arg);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price (KSH)</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Available</TableHead>
            <TableHead>Sales Count</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={`${product.id}-${index}`}>
              {editingId === product.id ? (
                <>
                  <TableCell>
                    <Input
                      value={editedProduct.name || ""}
                      onChange={(e) => handleChange(e, "name", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="string"
                      value={editedProduct.price || ""}
                      onChange={(e) => handleChange(e, "price", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedProduct.stock || ""}
                      onChange={(e) => handleChange(e, "stock", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedProduct.imageUrl || ""}
                      onChange={(e) =>
                        handleChange(e, "imageUrl", e.target.value)
                      }
                      placeholder="Image URL"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedProduct.description || ""}
                      onChange={(e) =>
                        handleChange(e, "description", e.target.value)
                      }
                      placeholder="Description"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={editedProduct.isAvailable || false}
                      onCheckedChange={() =>
                        handleCheckboxChange("isAvailable")
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedProduct.salesCount || ""}
                      onChange={(e) =>
                        handleChange(e, "salesCount", e.target.value)
                      }
                      placeholder="Sales Count"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedProduct.unit || ""}
                      onChange={(e) => handleChange(e, "unit", e.target.value)}
                      placeholder="Unit (kg, pcs, etc.)"
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button onClick={handleSave} className="bg-green-600">
                      {isLoading ? <p>Loading</p> : <p>Save</p>}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>KSH {product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 object-cover"
                      />
                    ) : (
                      "No image"
                    )}
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.isAvailable ? "✅" : "❌"}</TableCell>
                  <TableCell>{product.salesCount}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell className="flex gap-2">
                    {userRole === "admin" && (
                      <>
                        <Button onClick={() => handleEdit(product)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
