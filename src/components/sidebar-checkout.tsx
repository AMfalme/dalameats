"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { User, Trash2 } from "lucide-react";
import { TbBasketDown } from "react-icons/tb";
import { selectTotalCount } from "@/app/store/features/cartSlice";

import { useRemoveFromCart } from "@/hooks/useRemoveFromCart";
import { useRouter } from "next/navigation";
import Image from "next/image";
import beefkidneys from "@/static/img/beef kidneys.png";

export default function SlidingCart() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCount = useSelector(selectTotalCount);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  const { handleRemoveFromCart } = useRemoveFromCart();

  const navigateToCart = () => {
    router.push("/cart");
    setOpen(false);
  };

  return (
    <div>
      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center transition-transform"
      >
        <div className="relative">
          <TbBasketDown className="text-2xl" />
          {totalCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center shadow">
              {totalCount}
            </span>
          )}
        </div>
      </motion.button>

      {/* Sliding Cart */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full md:w-[400px] flex flex-col bg-white shadow-2xl rounded-l-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-amber-50">
            <h2 className="text-lg font-semibold text-gray-800">
              {user ? "Your Cart" : "Welcome"}
            </h2>
            {!user && (
              <div className="flex gap-2">
                <Link href="/login">
                  <Button size="sm">
                    <User className="w-4 h-4 mr-1" /> Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" variant="outline">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    layout
                    className="flex items-center gap-4 border rounded-xl p-3 hover:shadow-md transition"
                  >
                    <Image
                      src={item.imageUrl || beefkidneys}
                      alt={item.name}
                      width={70}
                      height={70}
                      className="rounded-lg object-cover shadow"
                    />
                    <div className="flex flex-col flex-1">
                      <span className="font-medium text-gray-800">
                        {item.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.price} KES each
                      </span>
                      <div className="flex items-center justify-between mt-1 text-sm text-gray-600">
                        <span>Qty: {item.quantity}</span>
                        <span className="font-semibold text-amber-600">
                          {(item.price * item.quantity).toFixed(2)} KES
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleRemoveFromCart(item)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center mt-10 text-center text-gray-500"
                >
                  <Image
                    src="/empty-cart.svg"
                    alt="Empty Cart"
                    width={120}
                    height={120}
                    className="mb-4 opacity-80"
                  />
                  <p>Your cart is empty</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Total + Checkout */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 border-t bg-amber-50 sticky bottom-0"
            >
              <div className="flex items-center justify-between mb-3 text-gray-700 font-medium">
                <span>Total</span>
                <span className="text-lg text-amber-700 font-semibold">
                  {totalPrice.toFixed(2)} KES
                </span>
              </div>
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium"
                onClick={navigateToCart}
              >
                Proceed to Checkout
              </Button>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
