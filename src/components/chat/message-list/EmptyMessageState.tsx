"use client";

import React from "react";
import { MessageSquareIcon, Loader2 } from "lucide-react";

interface EmptyMessageStateProps {
  isLoading: boolean;
}

export function EmptyMessageState({ isLoading }: EmptyMessageStateProps) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 sm:p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
            Loading conversation...
          </h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Please wait while we fetch your messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 sm:p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-xl">
            <MessageSquareIcon className="h-8 w-8 text-white" />
          </div>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
          Start the conversation
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          Type your message below to begin chatting with AI.
        </p>
      </div>
    </div>
  );
}
