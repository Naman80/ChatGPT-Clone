"use client";

import React, { memo } from "react";
import { type UIMessage } from "ai";
import { MessageList } from "../message-list";

interface ChatViewProps {
  messages: UIMessage[];
  isLoading: boolean;
  isStreaming: boolean;
}

export const ChatView = memo(
  ({ messages, isLoading, isStreaming }: ChatViewProps) => {
    return (
      <MessageList
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
      />
    );
  }
);

ChatView.displayName = "ChatView";
