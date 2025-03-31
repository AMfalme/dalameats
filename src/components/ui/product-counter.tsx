import { Button } from "@/components/ui/button";

import { CartItem } from "@/types/cart";
import { useAuth } from "../providers/auth-provider";
import { useDispatch } from "react-redux";
import { addItemToCart, removeCartItem } from "@/app/store/features/cartSlice";
import { AppDispatch } from "@/app/store/store";

interface ProductQuantityCounterProps {
  item: CartItem;
}

export default function ProductQuantityCounter({
  item,
}: ProductQuantityCounterProps) {
  // Component logic here, using the `item` prop

  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const handleAddToCart = (item: CartItem) => {
    if (user && user?.uid) {
      dispatch(addItemToCart({ uid: user?.uid, item: { id: item.productId } }));
    }
  };

  const handleRemoveFromCart = (item: CartItem) => {
    if (user && user?.uid) {
      console.log("We got here");
      dispatch(
        removeCartItem({ userId: user?.uid, item: { id: item.productId } })
      );
    }
  };
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
