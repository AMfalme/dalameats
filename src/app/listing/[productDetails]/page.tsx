"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
interface ProductDetailsProps {
  name: string;
  image: string;
  price: number;
  description: string;
}

export default function ProductDetails({
  name,
  image,
  price,
  description,
}: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      className="max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Product Image with Heart Button */}
      <div className="relative">
        <Image
          src={image}
          width={300}
          height={300}
          alt={name}
          className="w-full h-64 object-cover"
        />
        <button
          className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-md ${
            isFavorite ? "text-red-500" : "text-gray-500"
          }`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <Heart className="w-6 h-6" fill={isFavorite ? "red" : "none"} />
        </button>
      </div>

      {/* Product Content */}
      <div className="p-5 text-muted-foreground">
        <h2 className="text-2xl font-bold">{name}</h2>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
        <p className="text-xl font-semibold text-red-500 mt-4">${price}</p>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mt-4">
          <button
            className="p-2 border rounded-md hover:bg-gray-200"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus />
          </button>
          <span className="text-lg font-semibold">{quantity}</span>
          <button
            className="p-2 border rounded-md hover:bg-gray-200"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <Button variant="outline" className="hover:bg-gray-100">
            View Details
          </Button>
          <Button className="flex gap-2">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
