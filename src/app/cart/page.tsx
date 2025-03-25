"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";

import { addItemToCart, removeItem } from "@/app/store/features/cartSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import beefkidneys from "@/static/img/beef kidneys.png";
import { useAuth } from "@/components/providers/auth-provider";
import { CartItem } from "@/types/cart";
export default function CartCatalogue() {
  const { user } = useAuth();
  const dispatch = useDispatch<typeof store.dispatch>();

  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );

  const handleAddToCart = (item: CartItem) => {
    if (user && user.uid) {
      dispatch(addItemToCart({ userId: user.uid, item }));
    }
  };

  const total = cartItems.length;

  return (
    <div className="flex h-screen">
      {/* Left (Cart Items) */}
      <div className="flex-3 bg-gray-100 p-4 rounded-lg overflow-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          cartItems.map((item) => (
            <Card key={item.id} className="mb-3">
              <CardContent className="flex flex-col p-4">
                <div>
                  <Image
                    src={beefkidneys}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="h-32 object-cover rounded-md"
                  />
                </div>
                <div className="flex p-4 justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{item.name}</h3>
                    <p className="text-gray-600">${item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(removeItem(item.id))}
                    >
                      -
                    </Button>
                    <span className="font-semibold">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Right (Total & Checkout) */}
      <div className="flex-1 bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
        <h2 className="text-xl font-semibold">Order Summary</h2>
        <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
        <Button className="w-full mt-4">Proceed to Checkout</Button>
      </div>
    </div>
  );
}
