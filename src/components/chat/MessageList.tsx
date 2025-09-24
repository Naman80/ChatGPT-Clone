"use client";

import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { useChat } from "@/contexts/ChatContext";
import { MessageSquareIcon, SparklesIcon, Loader2 } from "lucide-react";

export function MessageList() {
  const { currentChat, isLoading, isLoadingMessages } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages]);

  console.log("[MessageList] Rendering with debug info:", {
    hasCurrent: !!currentChat,
    chatId: currentChat?.id,
    messageCount: currentChat?.messages?.length || 0,
    isLoading,
    isLoadingMessages,
    timestamp: new Date().toISOString(),
  });

  // Desktop/Mobile empty state when no chat selected
  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 sm:p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
              <SparklesIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back!
          </h2>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            Start a conversation by typing a message below or create a new chat
            from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  const messages = currentChat.messages || [];

  // Empty chat state with enhanced design
  if (messages.length === 0 && !isLoading && !isLoadingMessages) {
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

  // Loading messages state
  if (isLoadingMessages && messages.length === 0) {
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

  // Messages view with improved design
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {messages.map((message, index) => (
            <MessageItem
              key={message.id || `msg-${index}`}
              message={message}
              isLast={index === messages.length - 1}
            />
          ))}

          {/* Enhanced loading indicator for streaming response */}
          {isLoading && (
            <div className="flex justify-start px-4">
              <div className="flex items-start gap-3">
                {/* AI Avatar */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
                  <SparklesIcon className="h-4 w-4 text-white" />
                </div>

                {/* Typing indicator */}
                <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100 max-w-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
}
