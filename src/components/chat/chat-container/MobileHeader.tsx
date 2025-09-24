"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoreVertical } from "lucide-react";

interface MobileHeaderProps {
  onToggleSidebar: () => void;
}

export function MobileHeader({ onToggleSidebar }: MobileHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 lg:hidden bg-white border-b border-gray-200 flex-shrink-0">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
      >
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
}
