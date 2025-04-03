"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { useAuth } from "./providers/auth-provider";
import { usePathname } from "next/navigation";
import { CartWidget } from "./ui/cartwidget";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store/store";
import Icon from "@/static/img/dala meats logo.jpeg";
import Image from "next/image";
import { fetchCartItems } from "@/app/store/features/cartSlice";
import UserMenu from "./ui/profile-dropdown";

export default function Navbar() {
  const pathName = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCartItems(user?.uid));
    }
  }, [user?.uid, dispatch]);

  return (
    <nav className="w-full px-6 py-4 bg-background border-b border-border flex items-center justify-between main-nav sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-primary">
        <Image
          src={Icon}
          alt={"Dala Meats"}
          width={40}
          height={40}
          className="h-10 w-10 object-cover"
        />
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/catalogue"
          className={
            pathName == "/catalogue"
              ? "text-sm font-medium hover:underline text-white bg-primary p-5"
              : "px-4 py-2 bg-blue-600 text-white rounded-full w-25 text-center hover:bg-white-700 transition text-sm font-medium hover:underline bg-primary text-white "
          }
        >
          Shop Now
        </Link>
        <Link href="/" className="text-sm font-medium hover:underline">
          Home
        </Link>
        <Link href="#contact" className="text-sm font-medium hover:underline">
          Contact
        </Link>
        <Link href="/dashboard" className="text-sm font-medium hover:underline">
          Dashboard
        </Link>
        {user ? (
          <UserMenu />
        ) : (
          <Link href="/login" className="text-sm font-medium hover:underline">
            <Button variant="outline">Login</Button>
          </Link>
        )}
        <CartWidget />
      </div>
    </nav>
  );
}
