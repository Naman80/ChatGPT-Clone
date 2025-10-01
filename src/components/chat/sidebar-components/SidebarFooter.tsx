"use client";

import React, { memo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter = memo(({ isCollapsed }: SidebarFooterProps) => {
  const { user } = useUser();

  const handleProfileClick = useCallback(() => {
    console.log("Profile clicked");
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className={cn("border-t border-gray-100 p-1.5")}>
      <button
        className={cn(
          "w-full flex items-center gap-3 cursor-pointer px-2.5 py-1.5"
        )}
        onClick={handleProfileClick}
      >
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.firstName?.charAt(0) ||
            user?.emailAddresses[0]?.emailAddress?.charAt(0) ||
            "N"}
        </div>
        {!isCollapsed && (
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-gray-900">
              {user?.firstName ||
                user?.emailAddresses[0]?.emailAddress ||
                "User"}
            </div>
            <div className="text-xs text-gray-500">Free</div>
          </div>
        )}
      </button>
    </div>
  );
});

SidebarFooter.displayName = "SidebarFooter";
