"use client";

import React from "react";
import { NewChatInput } from "../input";

interface EmptyStateProps {
  onSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function EmptyState({ onSubmit, isLoading }: EmptyStateProps) {
  return (
    <>
      {/* Mobile view */}
      <div className="flex-1 flex flex-col lg:hidden">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl font-normal text-gray-900 leading-tight">
              What&apos;s on the agenda today?
            </h1>
          </div>
        </div>
        <div className="flex-shrink-0 p-4 pb-6">
          <NewChatInput onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex lg:flex-col lg:flex-1">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-3xl font-normal text-gray-900 leading-tight">
              What&apos;s on the agenda today?
            </h1>
          </div>
        </div>
        <div className="flex-shrink-0">
          <NewChatInput onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
