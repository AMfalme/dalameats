"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import Link from "next/link";

export default function UserMenu() {
  const auth = getAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="w-5 h-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-5 w-40">
        <DropdownMenuItem>
          <Link href="/dashboard" className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/dashboard" className="flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => signOut(auth)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
