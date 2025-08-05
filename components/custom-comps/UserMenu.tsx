// components/custom-comps/UserMenu.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Menu } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import HistoryButton from "./HistoryButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  variant?: "compact" | "full";
  className?: string;
}

export default function UserMenu({
  variant = "full",
  className = "",
}: UserMenuProps) {
  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={className}>
            <Menu className="w-6 h-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <HistoryButton variant="ghost" />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LogoutButton className="w-full justify-start" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <HistoryButton />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <User className="w-5 h-5" />
            Mon compte
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <LogoutButton className="w-full justify-start" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
