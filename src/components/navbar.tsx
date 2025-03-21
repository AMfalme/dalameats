import React from "react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { ThemeSelector } from "./theme-selector";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-background border-b border-border flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-primary">
        Dala Meats
      </Link>

      <div className="flex items-center gap-4">
        <Link href="/listing" className="text-sm font-medium hover:underline">
          Shop
        </Link>
        {/* <Link href="/dashboard" className="text-sm font-medium hover:underline">
          Dashboard
        </Link> */}
        <Link href="/login" className="text-sm font-medium hover:underline">
          <Button variant="outline">Login</Button>
        </Link>
        <ModeToggle />
      </div>
    </nav>
  );
}
