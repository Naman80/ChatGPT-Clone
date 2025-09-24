"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PanelRightIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  return (
    <div className={cn("flex items-center border-b border-gray-100")}>
      {!isCollapsed && (
        <div className="flex items-center justify-between w-full mx-2">
          <div className="flex items-center gap-3">
            <Button
              title="Expand sidebar"
              variant="ghost"
              onClick={onToggle}
              className="w-12 h-12 p-0 justify-center hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            >
              <PanelRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 w-8 h-8"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
