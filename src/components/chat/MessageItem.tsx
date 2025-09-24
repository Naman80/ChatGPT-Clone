"use client";

import React from "react";
import { UserIcon, BotIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
  isLast?: boolean;
}

export function MessageItem({ message, isLast = false }: MessageItemProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      // In a real app, you might want to show a toast notification here
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isUser) {
    // User message as a modern chat bubble
    return (
      <div className="flex justify-end mb-3 sm:mb-4 px-2 sm:px-4">
        <div className="group flex flex-col items-end max-w-[85%] sm:max-w-[80%] md:max-w-[70%]">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg shadow-blue-200/50 transform transition-all duration-200 hover:shadow-xl hover:shadow-blue-200/70">
            <div className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
              {message.content}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  // Assistant message with enhanced avatar and styling
  return (
    <div className="group flex w-full gap-3 mb-3 sm:mb-4 px-2 sm:px-4">
      {/* Enhanced Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-200/50 ring-2 ring-white">
        <BotIcon className="h-4 w-4 text-white" />
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-lg shadow-gray-200/50 border border-gray-100 transform transition-all duration-200 hover:shadow-xl hover:shadow-gray-200/70">
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap break-words text-gray-900 text-sm sm:text-base leading-relaxed">
              {message.content}
              {message.isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-green-500 ml-1 animate-pulse rounded" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 px-1">
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>

          {/* Enhanced Message Actions */}
          {message.content && !message.isStreaming && (
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-lg"
            >
              <CopyIcon className="h-3 w-3 mr-1" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
