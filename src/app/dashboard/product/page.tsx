"use client";

import Image from "next/image";
// import { fetchProducts, updateProduct } from "@/utils/firestore";
import data from "@/app/catalogue/data.json";
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
import { ChangeEvent, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
export default function AdminProductTable() {
  const [products, setProducts] = useState<Product[]>(data);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});

  // useEffect(() => {
  //   fetchProducts().then(setProducts);
  // }, []);

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
    console.log(setProducts);
  };

  const handleSave = async () => {
    if (editingId) {
      try {
        console.log("we got here: ");

        // const response = await fetch("/api/add-products", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(data as Product[]),
        // });

        // // console.log("response: ", response);

        // const responseData = await response.json();
        // console.log("responseData: ", responseData);
      } catch (error) {
        console.error("Error loading cart:", error);
      }
      // await updateProduct(editingId, editedProduct);
      // setProducts((prev) =>
      //   prev.map((p) => (p.id === editingId ? { ...p, ...editedProduct } : p))
      // );
      setEditingId(null);
    }
  };

  const handleChange = (
    _e: ChangeEvent<HTMLInputElement>,
    field: keyof Product,
    value: string | number
  ) => {
    setEditedProduct((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Price ($)</TableHead>
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
          {products.map((product) => (
            <TableRow key={product.id}>
              {editingId === product.id ? (
                <>
                  <TableCell>
                    <Input
                      value={editedProduct.name || ""}
                      onChange={(e) => handleChange(e, "name")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="string"
                      value={editedProduct.price || ""}
                      onChange={(e) => handleChange(e, "price")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editedProduct.stock || ""}
                      onChange={(e) => handleChange(e, "stock")}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedProduct.imageUrl || ""}
                      onChange={(e) => handleChange(e, "imageUrl")}
                      placeholder="Image URL"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedProduct.description || ""}
                      onChange={(e) => handleChange(e, "description")}
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
                      onChange={(e) => handleChange(e, "salesCount")}
                      placeholder="Sales Count"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedProduct.unit || ""}
                      onChange={(e) => handleChange(e, "unit")}
                      placeholder="Unit (kg, pcs, etc.)"
                    />
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      onClick={() => handleSave(product.id)}
                      className="bg-green-600"
                    >
                      Save
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
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
                  <TableCell>
                    <Button onClick={() => handleEdit(product)}>Edit</Button>
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
