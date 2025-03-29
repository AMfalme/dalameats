"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";
import { addItemToCart } from "@/app/store/features/cartSlice";
import { useAuth } from "@/components/providers/auth-provider";

interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const userId = user?.uid;
  const dispatch = useDispatch<AppDispatch>();
  //Hello Griffin
  const handleAddToCart = (item: Product) => {
    if (user && userId) {
      dispatch(addItemToCart({ userId: userId, item }));
    }
  };
  return (
    <div
      key={product.imageUrl}
      className="bg-background border border-border rounded-2xl shadow-md hover:shadow-lg transition p-4"
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        width={500}
        height={500}
        className="w-full h-48 object-cover rounded-xl"
      />
      <h3 className="mt-4 text-lg font-bold">{product.name}</h3>
      <p className="text-muted-foreground">{product.price}</p>
      <div className="mt-4 flex justify-between overflow-x-hidden whitespace-nowrap">
        <Button variant="outline" className="w-1/3 mr-2">
          View Details
        </Button>
        <Button className="w-1/3 ml-2" onClick={() => handleAddToCart(product)}>
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
