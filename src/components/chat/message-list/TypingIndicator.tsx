"use client";

import React from "react";
import { SparklesIcon } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex justify-start px-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
          <SparklesIcon className="h-4 w-4 text-white" />
        </div>
        <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100 max-w-xs">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span className="text-sm text-gray-500">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
