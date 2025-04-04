import { Button } from "@/components/ui/button";

import { CartItem } from "@/types/cart";
import { useAddToCart } from "@/hooks/useAddToCart";
interface ProductQuantityCounterProps {
  item: CartItem;
}
import { useRemoveFromCart } from "@/hooks/useRemoveFromCart";
export default function ProductQuantityCounter({
  item,
}: ProductQuantityCounterProps) {
  // Component logic here, using the `item` prop

  const { handleAddToCart } = useAddToCart();

  const { handleRemoveFromCart } = useRemoveFromCart();
  return (
    <div className="flex items-center gap-3">
      {/* Quantity Controls */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleRemoveFromCart(item)}
      >
        -
      </Button>
      <span className="text-lg font-semibold">{item.quantity}</span>
      <Button variant="outline" size="sm" onClick={() => handleAddToCart(item)}>
        +
      </Button>
    </div>
  );
}
