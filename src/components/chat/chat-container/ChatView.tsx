"use client";

import React from "react";
import { type UIMessage } from "ai";
import { NewChatInput } from "../input";
import { MessageList } from "../message-list";

interface ChatViewProps {
  messages: UIMessage[];
  isLoading: boolean;
  isLoadingMessages: boolean;
  onSubmit: (message: string) => Promise<void>;
}

export function ChatView({
  messages,
  isLoading,
  isLoadingMessages,
  onSubmit,
}: ChatViewProps) {
  return (
    <>
      <div className="flex-1 min-h-0 overflow-hidden">
        <MessageList
          messages={messages}
          isLoading={isLoading || isLoadingMessages}
        />
      </div>
      <div className="flex-shrink-0">
        <NewChatInput onSubmit={onSubmit} isLoading={isLoading} />
      </div>
    </>
  );
}
