"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { PanelRightIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const SidebarHeader = memo(
  ({ isCollapsed, onToggle }: SidebarHeaderProps) => {
    return (
      <div className={cn("flex items-center  p-1.5")}>
        <div className="flex items-center justify-between w-full">
          <Button
            title="Expand sidebar"
            variant="ghost"
            onClick={onToggle}
            className="p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            <div className="px-2.5 py-2">
              <PanelRightIcon className="h-5 w-5" />
            </div>
          </Button>

          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="p-0 justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <div className="px-2.5 py-2">
                <XIcon className="h-5 w-5" />
              </div>
            </Button>
          )}
        </div>
      </div>
    );
  }
);

SidebarHeader.displayName = "SidebarHeader";
