"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User, Palette } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";

export default function UserMenu() {
  const auth = getAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <User className="w-5 h-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mt-5 w-40">
        <DropdownMenuItem>
          <User className="w-4 h-4 mr-2" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Palette className="w-4 h-4 mr-2" />
          UI Theme
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
