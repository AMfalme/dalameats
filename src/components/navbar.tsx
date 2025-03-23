"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { useAuth } from "./providers/auth-provider";
import { getAuth, signOut } from "firebase/auth";

export default function Navbar() {
  const { user } = useAuth();
  const auth = getAuth();
  console.log(user, "user in navbar");
  console.log(auth, "auth in navbar");
  return (
    <nav className="w-full px-6 py-4 bg-background border-b border-border flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-primary">
        Dala Meats
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/catalogue" className="text-sm font-medium hover:underline">
          Shop
        </Link>
        {/* <Link href="/dashboard" className="text-sm font-medium hover:underline">
          Dashboard
        </Link> */}
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
      </div>
    </nav>
  );
}
