"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PenSquareIcon, SearchIcon, PanelRightIcon } from "lucide-react";

interface SidebarMenuProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

export function SidebarMenu({
  isCollapsed,
  onToggle,
  onNewChat,
}: SidebarMenuProps) {
  if (isCollapsed) {
    return (
      <div className="hidden lg:flex lg:flex-col lg:space-y-2">
        <Button
          onClick={onToggle}
          variant="ghost"
          className="w-12 h-12 p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
          title="Expand sidebar"
        >
          <PanelRightIcon className="h-4 w-4" />
        </Button>

        <Button
          onClick={onNewChat}
          variant="ghost"
          className="w-12 h-12 p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
          title="New chat"
        >
          <PenSquareIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          className="w-12 h-12 p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
          title="Search chats"
        >
          <SearchIcon className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={onNewChat}
        variant="ghost"
        className="w-full justify-start h-10 px-3 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-normal transition-colors duration-200"
      >
        <PenSquareIcon className="h-4 w-4 mr-3" />
        New chat
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start h-10 px-3 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-normal transition-colors duration-200"
      >
        <SearchIcon className="h-4 w-4 mr-3" />
        Search chats
      </Button>
    </>
  );
}
