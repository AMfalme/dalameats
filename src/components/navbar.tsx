"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "./providers/auth-provider";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { Menu, X } from "lucide-react"; // You can use any icon lib

import { AppDispatch } from "../app/store/store";
import Icon from "@/static/img/dala meats logo.jpeg";
import Image from "next/image";
import { fetchCartItems } from "@/app/store/features/cartSlice";
import UserMenu from "./ui/profile-dropdown";

export default function Navbar() {
  const pathName = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCartItems(user?.uid));
    }
  }, [user?.uid, dispatch]);

  return (
    <nav className="w-full px-6 py-4 bg-background border-b border-border flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold text-primary">
        <Image
          src={Icon}
          alt="Dala Meats"
          width={40}
          height={40}
          className="h-10 w-10 object-cover"
        />
      </Link>

      {/* Hamburger Button - Mobile only */}
      <button
        className="md:hidden text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Navigation Links */}
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-4 items-start md:items-center absolute md:static top-full left-0 w-full md:w-auto bg-background md:bg-transparent p-6 md:p-0 shadow md:shadow-none`}
      >
        <Link
          href="/catalogue"
          className={
            pathName == "/catalogue"
              ? "text-sm font-medium hover:underline rounded-full text-white bg-primary px-4 py-2"
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
        {user?.uid && (
          <Link
            href="/dashboard"
            className="text-sm font-medium hover:underline"
          >
            Dashboard
          </Link>
        )}
        {user ? (
          <UserMenu />
        ) : (
          <Link href="/login" className="text-sm font-medium hover:underline">
            <Button variant="outline">Sign in</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
