"use client";

import React from "react";
import { BotIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message } from "@/types/chat";

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

  if (isUser) {
    // User message as a modern chat bubble
    return (
      <div className="flex justify-end px-4 md:px-6 xl:px-16 py-12 pb-0 first:pt-3">
        <div className="group flex flex-col items-end max-w-[85%] sm:max-w-[80%] md:max-w-[70%]">
          <div className="bg-[#e5f3ff] text-[#00284d] rounded-[18px] px-4 py-3">
            <div className="whitespace-pre-wrap text-base">
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
    <div className="group flex w-full gap-3 px-4 md:px-6 xl:px-16 last:pb-10!">
      {/* Message Content */}
      <div className="flex flex-col w-full flex-1 mx-auto min-w-0 max-w-[40rem] xl:max-w-[48rem]">
        <div className="prose prose-sm max-w-full bg-white">
          <div className="whitespace-pre-wrap break- leading-normal text-gray-900 text-base">
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-green-500 ml-1 animate-pulse rounded" />
            )}
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
