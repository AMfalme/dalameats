import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

import { CartItem } from "@/types/cart";
import { useAddToCart } from "@/hooks/useAddToCart";
import { updateItemQuantity } from "@/app/store/features/cartSlice";
import { useDispatch } from "react-redux";

import { AppDispatch } from "@/app/store/store";
interface ProductQuantityCounterProps {
  item: CartItem;
}
import { useRemoveFromCart } from "@/hooks/useRemoveFromCart";
import { useState } from "react";
export default function ProductQuantityCounter({
  item,
}: ProductQuantityCounterProps) {
  const { user } = useAuth();

  // Component logic here, using the `item` prop
  const dispatch: AppDispatch = useDispatch();
  const [inputQty, setInputQty] = useState(item.quantity.toString());

  const { handleAddToCart } = useAddToCart();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setInputQty(val);
    }
  };

  const handleInputBlur = () => {
    console.log("blurred change kgs in cart");
    if (Number(inputQty) !== item.quantity && user?.uid) {
      dispatch(
        updateItemQuantity({
          uid: user?.uid,
          productId: item.productId,
          newQuantity: Number(inputQty),
        })
      );
    }
  };
  const { handleRemoveFromCart } = useRemoveFromCart();
  return (
    <div className="flex items-center space-x-3 bg-muted/10 p-2 rounded-xl shadow-sm w-fit">
      {/* Decrease button */}
      <Button
        variant="ghost"
        size="icon"
        className="border border-input text-lg rounded-full w-8 h-8 -mt-5"
        onClick={() => handleRemoveFromCart(item)}
      >
        −
      </Button>

      {/* Quantity Input */}
      <div className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Qty"
          className="text-center text-sm font-semibold w-16 h-8 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          value={inputQty}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
        <span className="text-[10px] text-muted-foreground mt-1">in kgs</span>
      </div>

      {/* Increase button */}
      <Button
        variant="ghost"
        size="icon"
        className="border border-input text-lg rounded-full w-8 h-8 -mt-5"
        onClick={() => handleAddToCart(item)}
      >
        +
      </Button>
    </div>
  );
}
