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
      <div>
        <p className="text-muted-foreground text-center text-xs">
          amount in kgs
        </p>
        <input
          type="text"
          placeholder="Qty"
          className="ml-4 border rounded-md px-2 py-1 w-20 text-sm"
          value={item.quantity}
        />
      </div>
      <Button variant="outline" size="sm" onClick={() => handleAddToCart(item)}>
        +
      </Button>
    </div>
  );
}
