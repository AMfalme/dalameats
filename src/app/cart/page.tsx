"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import ProductQuantityCounter from "@/components/ui/product-counter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
// import { useAuth } from "@/components/providers/auth-provider";
import { CartItem } from "@/types/cart";
export default function CartCatalogue() {
  const cartItems: CartItem[] = useSelector(
    (state: RootState) => state.cart.items
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // const total = cartItems.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 h-screen p-6">
      {/* Left Section (Cart Items) */}
      <div className="bg-gray-100 p-6 rounded-lg overflow-auto shadow-md">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No items in cart.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4 shadow-lg">
                <CardContent className="flex items-center gap-4">
                  {/* Product Image */}
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={100}
                    height={100}
                    className="h-24 w-24 object-cover rounded-md"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">
                      {item.unit}
                      KSH {item.price.toFixed(2)} per {item.unit}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Total:{" "}
                      <span className="text-blue-600">
                        KSH {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                  </div>

                  <ProductQuantityCounter item={item} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Right Section (Order Summary) */}
      <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col h-48">
        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
        <p className="text-lg font-semibold">
          Total: <span className="text-blue-600">KSH {totalPrice}</span>
        </p>
        <Button className="w-full mt-4">Make order now!</Button>
      </div>
    </div>
  );
}
