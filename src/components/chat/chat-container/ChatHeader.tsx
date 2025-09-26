"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-white flex-shrink-0 p-2 lg:px-6 lg:py-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 lg:hidden"
      >
        <MenuIcon className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 lg:hidden"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      <h1 className="text-xl font-semibold text-gray-900 hidden lg:block">
        ChatGPT Clone
      </h1>
    </div>
  );
}
