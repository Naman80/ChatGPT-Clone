"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { PenSquareIcon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SidebarMenuProps {
  isCollapsed: boolean;
}

export const SidebarMenu = memo(({ isCollapsed }: SidebarMenuProps) => {
  return (
    <div className={cn("flex flex-col p-1.5")}>
      <Link href="/">
        <Button
          variant="ghost"
          className="w-full justify-start px-2.5 py-1.5 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-normal transition-colors duration-200 cursor-pointer"
        >
          <div className="flex gap-1.5 items-center">
            <PenSquareIcon className="h-5 w-5" />
            {!isCollapsed && <span className="">New chat</span>}
          </div>
        </Button>
      </Link>

      <Button
        variant="ghost"
        className=" px-2.5 py-1.5 justify-start hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 font-normal transition-colors duration-200 cursor-pointer"
      >
        <div className="flex gap-1.5 items-center">
          <SearchIcon className="h-5 w-5" />
          {!isCollapsed && <span className="">Search chats</span>}
        </div>
      </Button>
    </div>
  );
});

SidebarMenu.displayName = "SidebarMenu";
