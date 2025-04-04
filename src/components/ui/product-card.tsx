import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store/store";

import { CartItem } from "@/types/cart";
import ProductQuantityCounter from "./product-counter";

import { useAddToCart } from "@/hooks/useAddToCart";
interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const { handleAddToCart } = useAddToCart();

  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );
  const productCartItem = cartItems.find(
    (item) => item.productId === product.id
  );

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
      <h3 className="mt-4 text-base font-bold">{product.name}</h3>
      <p className="text-muted-foreground text-xs">
        {product.price} KSH per {product.unit}
      </p>
      <div className="mt-4 flex justify-between overflow-x-hidden whitespace-nowrap">
        <Button variant="outline" className="w-1/3 mr-2 rounded-full">
          View Details
        </Button>
        {productCartItem ? (
          <ProductQuantityCounter item={productCartItem} />
        ) : (
          <Button
            className="w-1/3 ml-2 rounded-full"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
