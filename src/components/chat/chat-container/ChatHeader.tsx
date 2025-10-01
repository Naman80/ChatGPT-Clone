"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { MenuIcon, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between bg-white flex-shrink-0 px-2 md:p-2 border-b border-gray-100 h-14">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 md:hidden"
      >
        <MenuIcon className="h-4 w-4" />
      </Button>

      <div className="flex-1 items-center">
        <h1 className="text-lg font-normal text-nowrap px-2.5 text-gray-900">
          ChatGPT
        </h1>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
}
