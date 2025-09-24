import * as React from "react";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <div
      className={cn(
        "h-full w-full overflow-auto",
        "[&::-webkit-scrollbar]:w-2",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-gray-300",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb:hover]:bg-gray-400"
      )}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#d1d5db transparent",
      }}
    >
      {children}
    </div>
  </div>
));
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
