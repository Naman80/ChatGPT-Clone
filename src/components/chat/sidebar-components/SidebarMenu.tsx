"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { PenSquareIcon, SearchIcon, PanelRightIcon } from "lucide-react";
import Link from "next/link";

interface SidebarMenuProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarMenu = memo(
  ({ isCollapsed, onToggle }: SidebarMenuProps) => {
    if (isCollapsed) {
      return (
        <div className="hidden md:flex md:flex-col md:space-y-2">
          <Button
            onClick={onToggle}
            variant="ghost"
            className="w-12 h-12 p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 cursor-pointer"
            title="Expand sidebar"
          >
            <PanelRightIcon className="h-4 w-4" />
          </Button>

          <Link href="/">
            <Button
              variant="ghost"
              className="w-12 h-12 p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 cursor-pointer"
              title="New chat"
            >
              <PenSquareIcon className="h-4 w-4" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-12 h-12 p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 cursor-pointer"
            title="Search chats"
          >
            <SearchIcon className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <>
        <Link href="/">
          <Button
            variant="ghost"
            className="w-full justify-start h-10 px-3 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-normal transition-colors duration-200 cursor-pointer"
          >
            <PenSquareIcon className="h-4 w-4 mr-3" />
            New chat
          </Button>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start h-10 px-3 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-normal transition-colors duration-200 cursor-pointer"
        >
          <SearchIcon className="h-4 w-4 mr-3" />
          Search chats
        </Button>
      </>
    );
  }
);

SidebarMenu.displayName = "SidebarMenu";
