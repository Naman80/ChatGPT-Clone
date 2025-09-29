"use client";

import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { EmptyMessageState } from "./EmptyMessageState";
import { TypingIndicator } from "./TypingIndicator";
import { type UIMessage } from "ai";

interface MessageListProps {
  messages: UIMessage[];
  isLoading?: boolean;
  isStreaming?: boolean;
}
export function MessageList({
  messages = [],
  isLoading = false,
  isStreaming = false,
}: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Empty state when no messages
  if (messages.length === 0 && !isLoading) {
    return <EmptyMessageState isLoading={false} />;
  }

  // Loading messages state
  if (isLoading && messages.length === 0) {
    return <EmptyMessageState isLoading={true} />;
  }

  // Messages view with improved design
  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {messages.map((message, index) => {
            // Extract text content from UIMessage parts
            const textPart = (
              message as unknown as {
                parts?: Array<{ type: string; text: string }>;
              }
            ).parts?.find((part) => part.type === "text");
            const content =
              textPart?.text ||
              (message as unknown as { content?: string }).content ||
              "No content";

            // Convert UIMessage to MessageItem format
            const messageForItem = {
              id: message.id || `msg-${index}`,
              content:
                typeof content === "string" ? content : JSON.stringify(content),
              role: message.role as "user" | "assistant", // Filter out "system" role
              timestamp: new Date(), // UIMessage doesn't have timestamp, use current time
              isStreaming: false, // UIMessage doesn't have streaming state
            };

            // Skip system messages if any
            if (message.role === "system") {
              return null;
            }

            return (
              <MessageItem key={messageForItem.id} message={messageForItem} />
            );
          })}

          {/* Enhanced loading indicator for streaming response */}
          {isLoading && <TypingIndicator />}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
}
