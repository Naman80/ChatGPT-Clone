"use client";

import React from "react";
import { type UIMessage } from "ai";
import { MessageList } from "../message-list";

interface ChatViewProps {
  messages: UIMessage[];
  isLoading: boolean;
  isLoadingMessages: boolean;
}

export function ChatView({
  messages,
  isLoading,
  isLoadingMessages,
}: ChatViewProps) {
  return (
    <MessageList
      messages={messages}
      isLoading={isLoading || isLoadingMessages}
    />
  );
}
