"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { PanelRightIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  onToggle: () => void;
}

export const SidebarHeader = memo(({ onToggle }: SidebarHeaderProps) => {
  return (
    <div className={cn("flex items-center border-b border-gray-100 p-2")}>
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <Button
            title="Expand sidebar"
            variant="ghost"
            onClick={onToggle}
            className="md:h-11 md:w-11 md:p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            <PanelRightIcon className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="md:h-11 md:w-11 md:p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

SidebarHeader.displayName = "SidebarHeader";
