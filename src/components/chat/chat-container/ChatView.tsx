"use client";

import React, { memo } from "react";
import { type UIMessage } from "ai";
import { MessageList } from "../message-list";

interface ChatViewProps {
  messages: UIMessage[];
  isLoading: boolean;
  isLoadingMessages: boolean;
}

export const ChatView = memo(
  ({ messages, isLoading, isLoadingMessages }: ChatViewProps) => {
    return (
      <MessageList
        messages={messages}
        isLoading={isLoading || isLoadingMessages}
      />
    );
  }
);

ChatView.displayName = "ChatView";
