"use client";

import React from "react";
import { UserIcon, BotIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
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

  return (
    <div
      className={cn(
        "group flex w-full gap-4 p-4 md:p-6",
        isUser ? "bg-white" : "bg-gray-50"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser ? "bg-blue-600 text-white" : "bg-green-600 text-white"
        )}
      >
        {isUser ? (
          <UserIcon className="h-4 w-4" />
        ) : (
          <BotIcon className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-sm">
            {isUser ? "You" : "Assistant"}
          </span>
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap break-words">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
            )}
          </div>
        </div>

        {/* Message Actions */}
        {isAssistant && message.content && !message.isStreaming && (
          <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 px-2 text-gray-500 hover:text-gray-700"
            >
              <CopyIcon className="h-3 w-3 mr-1" />
              Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
