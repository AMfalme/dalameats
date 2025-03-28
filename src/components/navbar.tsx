"use client";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { useAuth } from "./providers/auth-provider";
import { getAuth, signOut } from "firebase/auth";
import { usePathname } from "next/navigation";
import { CartWidget } from "./ui/cartwidget";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store/store";
import { fetchCartItems } from "@/app/store/features/cartSlice";
export default function Navbar() {
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const pathName = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const auth = getAuth();
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCartItems(user?.uid));
    }
  }, [user?.uid, dispatch]);
  // const totalItems = useSelector(
  //   (state: RootState) => state.cart.items.length // Sum all item quantities
  // );

  return (
    <nav className="w-full px-6 py-4 bg-background border-b border-border flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-primary">
        Dala Meats
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/catalogue"
          className={
            pathName == "/catalogue"
              ? "text-sm font-medium hover:underline text-gray-500"
              : "text-sm font-medium hover:underline"
          }
        >
          Shop
        </Link>
        <Link href="/dashboard" className="text-sm font-medium hover:underline">
          Dashboard
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => signOut(auth)}>
              Logout
            </Button>
            <ModeToggle />
          </div>
        ) : (
          <Link href="/login" className="text-sm font-medium hover:underline">
            <Button variant="outline">Login</Button>
          </Link>
        )}
        <CartWidget productsCount={totalQuantity} />
      </div>
    </nav>
  );
}
