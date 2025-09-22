"use client";

import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageItem } from "./MessageItem";
import { useChat } from "@/contexts/ChatContext";
import { MessageSquareIcon, SparklesIcon } from "lucide-react";
import { Message } from "@/types/chat";

export function MessageList() {
  const { currentChat } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Desktop empty state
  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <SparklesIcon className="h-16 w-16 mx-auto text-gray-400" />
          </div>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Good to see you, Naman.
          </h2>
          <p className="text-gray-600 mb-6">
            Start a conversation by typing a message below or create a new chat
            from the sidebar.
          </p>
        </div>
      </div>
    );
  }

  // Desktop empty chat state
  if (currentChat.messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <MessageSquareIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Start the conversation
          </h3>
          <p className="text-gray-600">
            Type your message below to begin chatting.
          </p>
        </div>
      </div>
    );
  }

  // Messages view
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto p-4">
          {currentChat.messages.map((message: Message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
