"use client";

import React from "react";
import { MessageSquareIcon, Loader2 } from "lucide-react";

interface EmptyMessageStateProps {
  isLoading: boolean;
}

export function EmptyMessageState({ isLoading }: EmptyMessageStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 sm:p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-green-500 to-blue-500">
          {isLoading ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <MessageSquareIcon className="h-8 w-8 text-white" />
          )}
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
          {isLoading ? "Loading conversation..." : "Start the conversation"}
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {isLoading
            ? "Please wait while we fetch your messages."
            : "Type your message below to begin chatting with AI."}
        </p>
      </div>
    </div>
  );
}
