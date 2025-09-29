"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { EmptyState } from "./EmptyState";
import { ChatView } from "./ChatView";
import { Sidebar } from "../sidebar-components";
import { ChatInput } from "../input";
import { ChatHeader } from "./ChatHeader";
import { DefaultChatTransport } from "ai";
import { useParams, useRouter } from "next/navigation";
import { ChatNotFound } from "./ChatNotFound";

export function ChatContainer() {
  const router = useRouter();
  const { chatId } = useParams();

  const [error, setError] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Initialize useChat with fetched messages
  const { messages, setMessages, sendMessage, status, id } = useChat({
    transport: new DefaultChatTransport({
      api: chatId ? `/api/chats/${chatId}` : `/api/chats`,
    }),
    onFinish: () => {
      !chatId && router.replace(`c/${id}`); // important for changing url when new chat
    },
    onData: (data) => {
      console.log(data, "data part is received");
    },
  });

  const haveMessages = useMemo(() => messages.length > 0, [messages]);

  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (response.ok) {
        console.log("[ChatContainer] Initial messages:", result);

        setMessages(result.messages);
      } else {
        setError(result.error || "Failed to fetch messages");
      }
    } catch (err) {
      setError(
        `An error occurred: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }, [chatId]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On mobile, keep sidebar collapsed
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    if (window.innerWidth > 768) setIsSidebarCollapsed(false);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch initial messages when chatId is present
  useEffect(() => {
    if (!chatId) {
      return;
    }

    fetchMessages();
  }, [chatId, fetchMessages]);

  console.log("mess", messages, id);

  return (
    <div className="h-full flex bg-white">
      {/* Sidebar */}
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Mobile Header */}
        <ChatHeader onToggleSidebar={toggleSidebar} />

        {error ? (
          <ChatNotFound />
        ) : (
          <>
            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0">
              {!haveMessages ? (
                <EmptyState />
              ) : (
                <ChatView
                  messages={messages}
                  isLoading={status === "submitted" || status === "streaming"}
                  isLoadingMessages={status === "streaming"}
                />
              )}
            </div>
            <ChatInput
              onSubmit={(data) => {
                sendMessage({ text: data });
              }}
              isLoading={status === "submitted" || status === "streaming"}
            />
          </>
        )}
      </div>
    </div>
  );
}
