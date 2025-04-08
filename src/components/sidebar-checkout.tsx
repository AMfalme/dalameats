"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider"; // Adjust path accordingly
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { User } from "lucide-react";
import { TbBasketDown } from "react-icons/tb";
import { selectTotalCount } from "@/app/store/features/cartSlice";
import { useRouter } from "next/navigation";

export default function SlidingCart() {
  const navigate = useRouter();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCount = useSelector(selectTotalCount);
  const navigateToCart = () => {
    navigate.push("/cart");
    setOpen(!open);
  };

  return (
    <div>
      {/* Basket Button - Positioned on the left when the cart is open */}
      <Button
        variant="outline"
        className={` ${
          open ? "left-4" : "fixed right-4"
        } top-30 z-50 bg-amber-500 text-red rounded-full w-15 h-15 flex items-center justify-center transition-all`}
        onClick={() => setOpen(!open)}
      >
        <div className="relative">
          <div className="bg-amber-500 text-white p-4 rounded-full flex items-center justify-center">
            <TbBasketDown className="text-white text-8xl" />
            {totalCount > 0 && (
              <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {totalCount}
              </div>
            )}
          </div>
        </div>
      </Button>

      {/* Sliding Cart */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[100%] md:w-[30%] h-full flex flex-col bg-amber-50 shadow-lg transform transition-all ease-in-out duration-300"
        >
          {/* Header */}
          <div className="p-4 border-b bg-white">
            {!user ? (
              <div className="flex flex-col gap-2">
                <Link href="/login">
                  <Button className="w-full">
                    <User className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            ) : (
              <h2 className="text-lg font-semibold bg-white">Your Cart</h2>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 ">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <span>{item.name}</span>
                  <span className="font-semibold">x{item.quantity}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Your cart is empty</p>
            )}
          </div>

          {/* Checkout Button */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t">
              <Button className="w-full" onClick={navigateToCart}>
                Proceed to Checkout
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
