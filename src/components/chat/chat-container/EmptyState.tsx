"use client";

import React, { memo } from "react";

export const EmptyState = memo(() => {
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-3xl font-normal text-gray-900 leading-tight">
          What&apos;s on the agenda today?
        </h1>
      </div>
    </div>
  );
});

EmptyState.displayName = "EmptyState";
